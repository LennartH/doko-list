import { RoundData, Party, BockroundAfter } from './common';

export interface RuleSetConfig {
  announcementBehaviour: 'allPlusOne' | 'firstGetsPlusTwo' | 'firstDoubles' | 'allDouble';
  soloWinsOnTie: boolean;
  extraPointWhenCharlieTakesLastTrick: boolean;
  extraPointForCaughtCharlie: boolean;
  extraPointWhenFoxTakesLastTrick: boolean;
  extraPointWhenDulleCapturesDulle: boolean;
  losingPartyGetsNegatedScore: boolean;
  bockroundAfter: BockroundAfter[];
}

export const defaultRuleSetConfig: RuleSetConfig = {
  announcementBehaviour: 'allPlusOne',
  soloWinsOnTie: false,
  extraPointWhenCharlieTakesLastTrick: false,
  extraPointForCaughtCharlie: false,
  extraPointWhenFoxTakesLastTrick: false,
  extraPointWhenDulleCapturesDulle: false,
  losingPartyGetsNegatedScore: true,
  bockroundAfter: []
};

export class RuleSet {
  private winningParty: Party = undefined;

  constructor(public name: string, public config: RuleSetConfig) {}

  calculateScore(roundData: RoundData): RoundResult {
    this.winningParty = this.determineWinningParty(roundData);
    let winningPartyScore = 0;
    // TODO Bockround after lost announcement
    let isBockroundNext = roundData.points.re === 120 && this.bockroundAfter(BockroundAfter.ScoreTie);
    isBockroundNext = isBockroundNext || (roundData.wasSolo && this.bockroundAfter(BockroundAfter.Solo));

    const losingPartyPoints = roundData.points[this.otherParty(this.winningParty)];
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
    if (this.winningParty === 'contra') {
      // TODO Is this a special rule?
      winningPartyScore++;
    }

    // TODO Apply announcements

    winningPartyScore += this.specialRuleDelta(roundData.foxGotLastTrick, this.config.extraPointWhenFoxTakesLastTrick);
    winningPartyScore += this.specialRuleDelta(roundData.charlyGotLastTrick, this.config.extraPointWhenCharlieTakesLastTrick);
    winningPartyScore += this.specialRuleDelta(roundData.dulleCaughtDulle, this.config.extraPointWhenDulleCapturesDulle);
    winningPartyScore += this.specialRuleDelta(roundData.foxGotLastTrick, this.config.extraPointWhenFoxTakesLastTrick);

    const losingPartyScore = this.config.losingPartyGetsNegatedScore ? -1 * winningPartyScore : 0;
    const result: RoundResult = {
        re: this.winningParty === 're' ? winningPartyScore : losingPartyScore,
        contra: this.winningParty === 'contra' ? winningPartyScore : losingPartyScore,
        isBockroundNext
    };

    this.winningParty = undefined;
    return result;
  }

  private determineWinningParty(roundData: RoundData): Party {
    const partyWithMorePoints = roundData.points.re > roundData.points.contra ? 're' : 'contra';
    // TODO Check announcements
    return partyWithMorePoints;
  }

  private bockroundAfter(bockroundAfter: BockroundAfter): boolean {
      return this.config.bockroundAfter.some(e => e === bockroundAfter);
  }

  private otherParty(party: Party): Party {
    return party === 're' ? 'contra' : 're';
  }

  private specialRuleDelta(ruleParty: Party, ruleIsActive: boolean) {
    let delta = 0;
    if (ruleParty !== undefined && ruleIsActive) {
      delta = this.winningParty === ruleParty ? 1 : -1;
    }
    return delta;
  }
}

export interface RoundResult {
    re: number;
    contra: number;

    isBockroundNext: boolean;
}
