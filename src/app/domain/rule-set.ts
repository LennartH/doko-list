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
  consecutiveBockroundsStack: false
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
    let winningPartyScore = 1;

    let isBockroundNext = announcementWasLost && this.bockroundAfter(BockroundAfter.LostAnnouncement);
    isBockroundNext = isBockroundNext || (roundData.points.re === 120 && this.bockroundAfter(BockroundAfter.ScoreTie));
    isBockroundNext = isBockroundNext || (roundData.wasSolo && this.bockroundAfter(BockroundAfter.Solo));

    // Score based on points
    const losingPartyPoints = roundData.points[losingParty];
    if (losingPartyPoints === 0) {
      winningPartyScore++;
      isBockroundNext = isBockroundNext || this.bockroundAfter(BockroundAfter.WonSchwarz);
    }
    for (const pointThreshold of PointThreshold.values().slice(1, -1)) {
      if (losingPartyPoints < pointThreshold) {
        winningPartyScore++;
      }
    }

    // TODO Cleanup
    // Score based on announcements
    if (winningParty in roundData.announcements) {
      const winningPartyAnnouncement = roundData.announcements[winningParty];
      switch (this.config.announcementBehaviour) {
        case AnnouncementBehaviour.FirstGetsPlusTwo:
          winningPartyScore += 2;
          break;
        case AnnouncementBehaviour.FirstDoubles:
        case AnnouncementBehaviour.AllDouble:
          winningPartyScore *= 2;
          break;
        default:
          throw new Error(`Unknown announcement behaviour ${this.config.announcementBehaviour}`);
      }
      for (const threshold of PointThreshold.values().slice(0, -1)) {
        if (threshold >= winningPartyAnnouncement.lessThan) {
          switch (this.config.announcementBehaviour) {
            case AnnouncementBehaviour.FirstGetsPlusTwo:
            case AnnouncementBehaviour.FirstDoubles:
              winningPartyScore++;
              break;
            case AnnouncementBehaviour.AllDouble:
              winningPartyScore *= 2;
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
          switch (this.config.announcementBehaviour) {
            case AnnouncementBehaviour.FirstGetsPlusTwo:
            case AnnouncementBehaviour.FirstDoubles:
              winningPartyScore++;
              break;
            case AnnouncementBehaviour.AllDouble:
              winningPartyScore *= 2;
              break;
            default:
              throw new Error(`Unknown announcement behaviour ${this.config.announcementBehaviour}`);
          }
        }
      }
    }

    // Bonus Scores
    if (!roundData.wasSolo || this.config.bonusScoresOnSolo) {
      winningPartyScore += this.config.bonusScoreRules
        .map(r => this.extraScoreRuleDelta(winningParty, roundData, r))
        .reduce((sum, delta) => sum + delta, 0);
    }

    // Applying Bockrounds
    if (roundData.consecutiveBockrounds > 0) {
      let bockroundFactor = 2;
      if (this.config.consecutiveBockroundsStack) {
        bockroundFactor **= roundData.consecutiveBockrounds;
      }
      winningPartyScore *= bockroundFactor;
    }

    // Finalizing result
    isBockroundNext = isBockroundNext || winningPartyScore === 0;
    let losingPartyScore = this.config.losingPartyGetsNegatedScore ? -1 * winningPartyScore : 0;

    if (roundData.wasSolo) {
      if (winningParty === 're') {
        winningPartyScore *= 3;
      } else {
        losingPartyScore *= 3;
      }
    }

    return {
      re: winningParty === 're' ? winningPartyScore : losingPartyScore,
      contra: winningParty === 'contra' ? winningPartyScore : losingPartyScore,
      isBockroundNext
    };
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
    return this.config.bockroundAfter.some(e => e === bockroundAfter);
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
    return JSON.stringify({name: this.name, config: this.config});
  }
}

export interface RoundResult {
  re: number;
  contra: number;

  isBockroundNext: boolean;
}
