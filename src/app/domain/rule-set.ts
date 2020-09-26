import { Message } from '../services/messages.service';
import { AnnouncementBehaviour, BockroundAfter, BonusScore, Party, PointThreshold } from './common';
import { RoundData } from './round-data';

export interface RuleSetConfig {
  announcementBehaviour: AnnouncementBehaviour;
  losingAnnouncementsGivesScore: boolean;
  soloWinsOnTie: boolean;
  losingPartyGetsNegatedScore: boolean;
  bonusScoreRules: BonusScore[];
  bonusScoresOnSolo: boolean;
  bockroundAfter: BockroundAfter[];
  consecutiveBockroundsStack: boolean;
}

export const defaultRuleSetConfig: RuleSetConfig = {
  announcementBehaviour: AnnouncementBehaviour.FirstGetsPlusTwo,
  losingAnnouncementsGivesScore: true,
  soloWinsOnTie: false,
  losingPartyGetsNegatedScore: true,
  bonusScoreRules: [BonusScore.WhenWinningAgainstDames, BonusScore.ForDoppelkopf, BonusScore.ForCaughtFox],
  bonusScoresOnSolo: false,
  bockroundAfter: [],
  consecutiveBockroundsStack: false,
};

export class RuleSet {
  static fromJson(data: string) {
    const json = JSON.parse(data);
    return new RuleSet(json.name, json.config);
  }

  constructor(public name: string, public config: RuleSetConfig) {}

  calculateScore(roundData: RoundData): RoundResult {
    const [winningParty, announcementWasLost] = this.determineWinningParty(roundData);
    const losingParty = this.otherParty(winningParty);
    let winningPartyPoints = 0;
    const details: RoundResultDetail[] = [];

    let isBockroundNext = announcementWasLost && this.bockroundAfter(BockroundAfter.LostAnnouncement);
    isBockroundNext = isBockroundNext || (roundData.points.re === 120 && this.bockroundAfter(BockroundAfter.ScoreTie));
    isBockroundNext = isBockroundNext || (roundData.wasSolo && this.bockroundAfter(BockroundAfter.Solo));

    // Score based on points
    const losingPartyPoints = roundData.points[losingParty];
    if (losingPartyPoints === 0) {
      winningPartyPoints++;
      details.push({ message: this.message('schwarz'), delta: 1, intermediatePoints: winningPartyPoints });
      isBockroundNext = isBockroundNext || this.bockroundAfter(BockroundAfter.WonSchwarz);
    }
    for (const pointThreshold of PointThreshold.values().slice(1, -1)) {
      if (losingPartyPoints < pointThreshold) {
        winningPartyPoints++;
        details.push({ message: this.message('lessThanThreshold', pointThreshold), delta: 1, intermediatePoints: winningPartyPoints });
      }
    }
    winningPartyPoints++;
    details.push({ message: this.message('won'), delta: 1, intermediatePoints: winningPartyPoints });

    // TODO Cleanup
    // Score based on announcements
    if (winningParty in roundData.announcements) {
      const winningPartyAnnouncement = roundData.announcements[winningParty];
      switch (this.config.announcementBehaviour) {
        case AnnouncementBehaviour.FirstGetsPlusTwo:
          winningPartyPoints += 2;
          details.push({ message: this.message('partyAnnounced', winningParty), delta: 2, intermediatePoints: winningPartyPoints });
          break;
        case AnnouncementBehaviour.FirstDoubles:
        case AnnouncementBehaviour.AllDouble:
          winningPartyPoints *= 2;
          details.push({ message: this.message('partyAnnounced', winningParty), factor: 2, intermediatePoints: winningPartyPoints });
          break;
        default:
          throw new Error(`Unknown announcement behaviour ${this.config.announcementBehaviour}`);
      }
      for (const threshold of PointThreshold.values().slice(0, -1)) {
        if (threshold >= winningPartyAnnouncement.lessThan) {
          switch (this.config.announcementBehaviour) {
            case AnnouncementBehaviour.FirstGetsPlusTwo:
            case AnnouncementBehaviour.FirstDoubles:
              winningPartyPoints++;
              details.push({
                message: this.message('lessThanThresholdAnnounced', threshold),
                delta: 1,
                intermediatePoints: winningPartyPoints,
              });
              break;
            case AnnouncementBehaviour.AllDouble:
              winningPartyPoints *= 2;
              details.push({
                message: this.message('lessThanThresholdAnnounced', threshold),
                factor: 2,
                intermediatePoints: winningPartyPoints,
              });
              break;
            default:
              throw new Error(`Unknown announcement behaviour ${this.config.announcementBehaviour}`);
          }
        }
      }
    }
    if (losingParty in roundData.announcements && this.config.losingAnnouncementsGivesScore) {
      const losingPartyAnnouncement = roundData.announcements[losingParty];
      for (const threshold of PointThreshold.values()) {
        if (threshold >= losingPartyAnnouncement.lessThan) {
          const message = threshold === 120 ? this.message('partyAnnouncedLost', losingParty)
                                            : this.message('lessThanThresholdAnnouncedLost', threshold);
          switch (this.config.announcementBehaviour) {
            case AnnouncementBehaviour.FirstGetsPlusTwo:
            case AnnouncementBehaviour.FirstDoubles:
              winningPartyPoints++;
              details.push({ message, delta: 1, intermediatePoints: winningPartyPoints });
              break;
            case AnnouncementBehaviour.AllDouble:
              winningPartyPoints *= 2;
              details.push({ message, factor: 2, intermediatePoints: winningPartyPoints });
              break;
            default:
              throw new Error(`Unknown announcement behaviour ${this.config.announcementBehaviour}`);
          }
        }
      }
    }

    // Bonus Scores
    if (!roundData.wasSolo || this.config.bonusScoresOnSolo) {
      for (const bonusScoreRule of this.config.bonusScoreRules) {
        const delta = this.extraScoreRuleDelta(winningParty, roundData, bonusScoreRule);
        if (delta !== 0) {
          // TODO Separate positive and negative bonus scores
          winningPartyPoints += delta;
          details.push({ message: this.message(bonusScoreRule), delta, intermediatePoints: winningPartyPoints });
        }
      }
    }

    // Applying Bockrounds
    if (roundData.consecutiveBockrounds > 0) {
      let bockroundFactor = 2;
      if (this.config.consecutiveBockroundsStack) {
        bockroundFactor **= roundData.consecutiveBockrounds;
      }
      const key = bockroundFactor > 2 ? 'bockrounds' : 'bockround';
      winningPartyPoints *= bockroundFactor;
      details.push({ message: this.message(key), factor: bockroundFactor, intermediatePoints: winningPartyPoints });
    }

    // Finalizing result
    isBockroundNext = isBockroundNext || winningPartyPoints === 0;
    let losingPartyScore = this.config.losingPartyGetsNegatedScore ? -1 * winningPartyPoints : 0;

    if (roundData.wasSolo) {
      if (winningParty === 're') {
        winningPartyPoints *= 3;
      } else {
        losingPartyScore *= 3;
      }
    }

    return {
      re: winningParty === 're' ? winningPartyPoints : losingPartyScore,
      contra: winningParty === 'contra' ? winningPartyPoints : losingPartyScore,
      details,
      isBockroundNext,
    };
  }

  private message(key: string, ...args: any[]) {
    if (args.length === 0) {
      return { key };
    }

    const parties = Party.values();
    args = args.map((arg) => (parties.includes(arg) ? `$${arg}` : arg));
    return { key, args };
  }

  private determineWinningParty(roundData: RoundData): [Party, boolean] {
    let partyWithMorePoints: Party;
    if (roundData.points.re === 120 && roundData.wasSolo && this.config.soloWinsOnTie) {
      partyWithMorePoints = 're';
    } else {
      partyWithMorePoints = roundData.points.re > roundData.points.contra ? 're' : 'contra';
    }
    const partyWithLessPoints = this.otherParty(partyWithMorePoints);

    let winningParty: Party = partyWithMorePoints;
    let announcementWasLost = partyWithLessPoints in roundData.announcements;
    if (partyWithMorePoints in roundData.announcements) {
      const lessPoints = roundData.points[partyWithLessPoints];
      const announcementToCheck = roundData.announcements[partyWithMorePoints];
      if (lessPoints !== 0 && lessPoints >= announcementToCheck.lessThan) {
        winningParty = partyWithLessPoints;
        announcementWasLost = true;
      }
    }

    return [winningParty, announcementWasLost];
  }

  private bockroundAfter(bockroundAfter: BockroundAfter): boolean {
    return this.config.bockroundAfter.some((e) => e === bockroundAfter);
  }

  private otherParty(party: Party): Party {
    return party === 're' ? 'contra' : 're';
  }

  private extraScoreRuleDelta(winningParty: Party, roundData: RoundData, rule: BonusScore): number {
    const ruleDelta = (ruleParty: Party) => {
      let _delta = 0;
      if (ruleParty !== undefined) {
        _delta = winningParty === ruleParty ? 1 : -1;
      }
      return _delta;
    };

    let delta = 0;
    switch (rule) {
      case BonusScore.WhenWinningAgainstDames:
        // TODO Option for not when solo
        if (winningParty === 'contra') {
          delta = 1;
        }
        break;
      case BonusScore.ForDoppelkopf:
        for (const doppelkopf of roundData.doppelkopfs) {
          delta += ruleDelta(doppelkopf);
        }
        break;
      case BonusScore.ForCaughtFox:
        for (const caughtFox of roundData.foxesCaught) {
          delta += ruleDelta(caughtFox);
        }
        break;
      case BonusScore.WhenCharlieTakesLastTrick:
        delta = ruleDelta(roundData.charlyGotLastTrick);
        break;
      case BonusScore.ForCaughtCharlie:
        for (const caughtCharlie of roundData.charliesCaught) {
          delta += ruleDelta(caughtCharlie);
        }
        break;
      case BonusScore.WhenFoxTakesLastTrick:
        delta = ruleDelta(roundData.foxGotLastTrick);
        break;
      case BonusScore.WhenDulleCapturesDulle:
        delta = ruleDelta(roundData.dulleCaughtDulle);
        break;
      default:
        throw new Error(`Unknown extra score rule ${rule}`);
    }
    return delta;
  }

  toJson(): string {
    return JSON.stringify({ name: this.name, config: this.config });
  }
}

export interface RoundResult {
  re: number;
  contra: number;
  details: RoundResultDetail[];

  isBockroundNext: boolean;
}

export interface RoundResultDetail {
  message: Message;
  delta?: number;
  factor?: number;
  intermediatePoints: number;
}
