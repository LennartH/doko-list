import { RuleSetConfig, RuleSet, RoundResult } from './rule-set';
import { RoundData } from './round-data';
import { Party } from './common';

export interface Round {
  playerParties: { [player: string]: Party };
  roundData: RoundData;
  result: RoundResult;
}

export interface Scores {
  [player: string]: { total: number; delta: number };
}

export class GameList {
  readonly players: string[];
  readonly rounds: Round[];

  private _endDate: Date;
  private _finalScores: Scores;

  ruleSet: RuleSet;

  static fromJson(data: string): GameList {
    const json = JSON.parse(data);
    const list = new GameList(json.id, new Date(json.startDate), json.players, json.ruleSetName, json.ruleSetConfig);
    if ('rounds' in json) {
      list.rounds.push(...json.rounds);
      for (const round of list.rounds) {
        const roundData = round.roundData;
        roundData.charliesCaught = [
          roundData.charliesCaught[0] === null ? undefined : roundData.charliesCaught[0],
          roundData.charliesCaught[1] === null ? undefined : roundData.charliesCaught[1],
        ];
        roundData.foxesCaught = [
          roundData.foxesCaught[0] === null ? undefined : roundData.foxesCaught[0],
          roundData.foxesCaught[1] === null ? undefined : roundData.foxesCaught[1],
        ];
      }
    }
    if ('endDate' in json) {
      list._endDate = new Date(json.endDate);
      list._finalScores = json.finalScores;
    }
    return list;
  }

  constructor(public readonly id: string, public startDate: Date, players: string[], ruleSetName: string, ruleSetConfig: RuleSetConfig) {
    this.players = [...players];
    this.ruleSet = new RuleSet(ruleSetName, ruleSetConfig);
    this.rounds = [];
  }

  get isFinished(): boolean {
    return this.endDate !== undefined;
  }

  get endDate(): Date {
    return this._endDate;
  }

  set endDate(date: Date) {
    if (!date) {
      throw new Error("The given date mustn't be null or undefined");
    }

    this._endDate = date;
    const scores = this.scores;
    this._finalScores = scores[scores.length - 1];
  }

  get finalScores(): Scores {
    return this._finalScores;
  }

  get winner(): string {
    if (!this.finalScores) {
      return null;
    }

    return Object.keys(this.finalScores)
      .map((p) => {
        return { player: p, total: this.finalScores[p].total };
      })
      .reduce((previous, current) => {
        return !previous || current.total > previous.total ? current : previous;
      }).player;
  }

  getConsecutiveBockrounds(): number {
    let consecutivBockrounds = 0;
    let index = this.rounds.length - 1;
    while (this.rounds[index]?.result.isBockroundNext) {
      consecutivBockrounds++;
      index--;
    }
    return consecutivBockrounds;
  }

  addRound(playerParties: { [player: string]: Party }, roundData: RoundData) {
    const result = this.ruleSet.calculateScore(roundData);
    this.rounds.push({ playerParties, roundData, result });
  }

  removeRound(roundNumber: number) {
    if (roundNumber < 0 || roundNumber >= this.rounds.length) {
      return;
    }
    this.rounds.splice(roundNumber, 1);
  }

  get scores(): { [player: string]: { total: number; delta: number } }[] {
    const scores = [];
    let previousRoundScore: { [player: string]: { total: number; delta: number } };
    for (const round of this.rounds) {
      const roundScore = {};
      for (const player in round.playerParties) {
        if (round.playerParties.hasOwnProperty(player)) {
          const party = round.playerParties[player];
          const playerResult = round.result[party];
          const previousTotalScore = previousRoundScore ? previousRoundScore[player].total : 0;
          roundScore[player] = { total: previousTotalScore + playerResult, delta: playerResult };
        }
      }
      scores.push(roundScore);
      previousRoundScore = roundScore;
    }
    return scores;
  }

  toJson(): string {
    const data: any = {
      id: this.id,
      players: this.players,
      startDate: this.startDate,
      ruleSetName: this.ruleSet.name,
      ruleSetConfig: this.ruleSet.config,
    };
    if (this.rounds.length > 0) {
      data.rounds = this.rounds;
    }
    if (this.endDate) {
      data.endDate = this.endDate;
      data.finalScores = this.finalScores;
    }
    return JSON.stringify(data);
  }
}
