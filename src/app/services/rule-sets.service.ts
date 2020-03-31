import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { defaultRuleSetConfig, RuleSet, RuleSetConfig } from '../domain/rule-set';
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

  addRuleSet(name: string, config: RuleSetConfig) {
    this._ruleSets.push(new RuleSet(name, config));
    this.ruleSetsSubject.next(this._ruleSets);
  }

  deleteRuleSet(name: string) {
    if (name === defaultRuleSet.name) {
      console.error(`The rule set ${defaultRuleSet.name} can not be deleted.`);
      return;
    }

    this._ruleSets = this._ruleSets.filter(r => r.name !== name);
    this.ruleSetsSubject.next(this._ruleSets);
  }

  editRuleSet(name: string, newName: string, newConfig: RuleSetConfig) {
    if (name === defaultRuleSet.name) {
      console.error(`The rule set ${defaultRuleSet.name} can not be changed.`);
      return;
    }

    const index = this._ruleSets.findIndex(r => r.name === name);
    this._ruleSets[index] = new RuleSet(newName, newConfig);
    this.ruleSetsSubject.next(this._ruleSets);
  }
}
