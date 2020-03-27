import { AnnouncementBehaviour, BockroundAfter, ExtraScore, Party } from './common';
import { RoundData } from './round-data';

export interface RuleSetConfig {
  announcementBehaviour: AnnouncementBehaviour;
  soloWinsOnTie: boolean;
  losingPartyGetsNegatedScore: boolean;
  extraScoreRules: ExtraScore[];
  bockroundAfter: BockroundAfter[];
}

export const defaultRuleSetConfig: RuleSetConfig = {
  announcementBehaviour: AnnouncementBehaviour.AllPlusOne,
  soloWinsOnTie: false,
  losingPartyGetsNegatedScore: true,
  extraScoreRules: [ExtraScore.ForDoppelkopf],
  bockroundAfter: []
};

export class RuleSet {
  constructor(public name: string, public config: RuleSetConfig) {}

  calculateScore(roundData: RoundData): RoundResult {
    const [winningParty, announcementWasLost] = this.determineWinningParty(roundData);
    let winningPartyScore = 0;

    let isBockroundNext = announcementWasLost && this.bockroundAfter(BockroundAfter.LostAnnouncement);
    isBockroundNext = roundData.points.re === 120 && this.bockroundAfter(BockroundAfter.ScoreTie);
    isBockroundNext = isBockroundNext || (roundData.wasSolo && this.bockroundAfter(BockroundAfter.Solo));

    const losingPartyPoints = roundData.points[this.otherParty(winningParty)];
    if (losingPartyPoints === 0) {
      winningPartyScore++;
      isBockroundNext = isBockroundNext || this.bockroundAfter(BockroundAfter.WonSchwarz);
    }
    for (const pointThreshold of [30, 60, 90]) {
      if (losingPartyPoints < pointThreshold) {
        winningPartyScore++;
      }
    }
    winningPartyScore++;
    if (winningParty === 'contra' && !roundData.wasSolo) {
      // TODO Is this a special rule?
      winningPartyScore++;
    }

    // TODO Apply announcements

    winningPartyScore += this.config.extraScoreRules
      .map(r => this.extraScoreRuleDelta(winningParty, roundData, r))
      .reduce((sum, delta) => sum + delta, 0);

    let losingPartyScore = this.config.losingPartyGetsNegatedScore ? -1 * winningPartyScore : 0;
    isBockroundNext = isBockroundNext || winningPartyScore === 0;

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
    const partyWithMorePoints = roundData.points.re > roundData.points.contra ? 're' : 'contra';
    const announcementWasLost = false;
    // TODO Check announcements
    return [partyWithMorePoints, announcementWasLost];
  }

  private bockroundAfter(bockroundAfter: BockroundAfter): boolean {
    return this.config.bockroundAfter.some(e => e === bockroundAfter);
  }

  private otherParty(party: Party): Party {
    return party === 're' ? 'contra' : 're';
  }

  private extraScoreRuleDelta(winningParty: Party, roundData: RoundData, rule: ExtraScore): number {
    const ruleDelta = (ruleParty: Party) => {
      let _delta = 0;
      if (ruleParty !== undefined) {
        _delta = winningParty === ruleParty ? 1 : -1;
      }
      return _delta;
    };

    let delta = 0;
    switch (rule) {
      case ExtraScore.ForDoppelkopf:
        for (const doppelkopf of roundData.doppelkopfs) {
          delta += ruleDelta(doppelkopf);
        }
        break;
      case ExtraScore.ForCaughtFox:
        for (const caughtFox of roundData.foxesCaught) {
          delta += ruleDelta(caughtFox);
        }
        break;
      case ExtraScore.WhenCharlieTakesLastTrick:
        delta = ruleDelta(roundData.charlyGotLastTrick);
        break;
      case ExtraScore.ForCaughtCharlie:
        for (const caughtCharlie of roundData.charliesCaught) {
          delta += ruleDelta(caughtCharlie);
        }
        break;
      case ExtraScore.WhenFoxTakesLastTrick:
        delta = ruleDelta(roundData.foxGotLastTrick);
        break;
      case ExtraScore.WhenDulleCapturesDulle:
        delta = ruleDelta(roundData.dulleCaughtDulle);
        break;
      default:
        throw new Error(`Unknown extra score rule ${rule}`);
    }
    return delta;
  }
}

export interface RoundResult {
  re: number;
  contra: number;

  isBockroundNext: boolean;
}
