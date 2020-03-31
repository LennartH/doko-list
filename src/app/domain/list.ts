import { RuleSetConfig, RuleSet, RoundResult } from './rule-set';
import { RoundData } from './round-data';
import { Party } from './common';

export interface Round {
    playerParties: {[player: string]: Party};
    roundData: RoundData;
    result: RoundResult;
}

export class GameList {
    readonly players: string[];
    readonly rounds: Round[];
    endDate: Date;

    ruleSet: RuleSet;

    constructor(
        public readonly id: string,
        public startDate: Date,
        players: string[],
        ruleSetName: string,
        ruleSetConfig: RuleSetConfig
    ) {
        this.players = [...players];
        this.ruleSet = new RuleSet(ruleSetName, ruleSetConfig);
    }

    get isFinished(): boolean {
        return this.endDate !== undefined;
    }

    addRound(playerParties: {[player: string]: Party}, roundData: RoundData) {
        const result = this.ruleSet.calculateScore(roundData);
        this.rounds.push({playerParties, roundData, result});
    }

    get scores(): {[player: string]: {total: number, delta: number}}[] {
        const scores = [];
        let previousRoundScore: {[player: string]: {total: number, delta: number}};
        for (const round of this.rounds) {
            const roundScore = {};
            for (const player in round.playerParties) {
                if (round.playerParties.hasOwnProperty(player)) {
                    const party = round.playerParties[player];
                    const playerResult = round.result[party];
                    const previousTotalScore = previousRoundScore ? previousRoundScore[player].total : 0;
                    roundScore[player] = {total: previousTotalScore + playerResult, delta: playerResult};
                }
            }
            scores.push(roundScore);
            previousRoundScore = roundScore;
        }
        return scores;
    }
}
