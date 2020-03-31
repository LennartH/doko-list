import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { defaultRuleSetConfig, RuleSet } from '../domain/rule-set';
import { AnnouncementBehaviour, BonusScore, BockroundAfter } from '../domain/common';
import { $enum } from 'ts-enum-util';

export const defaultRuleSet = new RuleSet('Tunierspielregeln', defaultRuleSetConfig);

@Injectable({
  providedIn: 'root'
})
export class RuleSetsService {

  private _ruleSets: RuleSet[] = [
    defaultRuleSet,
    new RuleSet('Vollständig', {
      announcementBehaviour: AnnouncementBehaviour.FirstDoubles,
      losingAnnouncementsGivesScore: true,
      soloWinsOnTie: true,
      losingPartyGetsNegatedScore: true,
      bonusScoreRules: $enum(BonusScore).getValues(),
      bonusScoresOnSolo: true,
      bockroundAfter: $enum(BockroundAfter).getValues(),
      consecutiveBockroundsStack: true
    })
  ];
  private ruleSetsSubject = new BehaviorSubject<RuleSet[]>(this._ruleSets);

  constructor(
  ) {
  }

  get ruleSets(): Observable<RuleSet[]> {
    return this.ruleSetsSubject.asObservable();
  }

  ruleSet(name: string): Observable<RuleSet> {
    return this.ruleSets.pipe(take(1), map(ruleSets => ruleSets.find(r => r.name === name)));
  }

  addRuleSet(ruleSet: RuleSet) {
    this._ruleSets.push(ruleSet);
    this.ruleSetsSubject.next(this._ruleSets);
  }

  deleteRuleSet(ruleSet: RuleSet) {
    if (ruleSet.name === defaultRuleSet.name) {
      console.error('The rule set Tunierspielregeln can not be deleted.');
      return;
    }

    this._ruleSets = this._ruleSets.filter(r => r.name !== ruleSet.name);
    this.ruleSetsSubject.next(this._ruleSets);
  }

  editRuleSet(name: string, newValue: RuleSet) {
    if (name === defaultRuleSet.name) {
      console.error('The rule set Tunierspielregeln can not be changed.');
      return;
    }

    const index = this._ruleSets.findIndex(r => r.name === name);
    this._ruleSets[index] = newValue;
    this.ruleSetsSubject.next(this._ruleSets);
  }
}
