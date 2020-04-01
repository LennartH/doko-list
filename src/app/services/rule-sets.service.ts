import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { defaultRuleSetConfig, RuleSet, RuleSetConfig } from '../domain/rule-set';
import { AnnouncementBehaviour, BonusScore, BockroundAfter } from '../domain/common';
import { $enum } from 'ts-enum-util';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const storageKeyPrefix = 'rule/';

export const defaultRuleSet = new RuleSet('Tunierspielregeln', defaultRuleSetConfig);

@Injectable({
  providedIn: 'root'
})
export class RuleSetsService {

  private _ruleSets: RuleSet[] = [];
  private ruleSetsSubject = new BehaviorSubject<RuleSet[]>(this._ruleSets);

  constructor(
  ) {
    Storage.keys().then(({ keys }) => {
      Promise.all(
        keys.filter(k => k.startsWith(storageKeyPrefix))
            .map(key => Storage.get({ key }))
      ).then(values => {
        this._ruleSets = [defaultRuleSet];
        this._ruleSets.push(...values.map(v => RuleSet.fromJson(v.value)));
        this.ruleSetsSubject.next(this._ruleSets);
      });
    });
  }

  get ruleSets(): Observable<RuleSet[]> {
    return this.ruleSetsSubject.asObservable();
  }

  ruleSet(name: string): Observable<RuleSet> {
    return this.ruleSets.pipe(take(1), map(ruleSets => ruleSets.find(r => r.name === name)));
  }

  addRuleSet(name: string, config: RuleSetConfig) {
    const ruleSet = new RuleSet(name, config);
    Storage.set({key: storageKeyPrefix + ruleSet.name, value: ruleSet.toJson()});
    this._ruleSets.push(ruleSet);
    this.ruleSetsSubject.next(this._ruleSets);
  }

  deleteRuleSet(name: string) {
    if (name === defaultRuleSet.name) {
      console.error(`The rule set ${defaultRuleSet.name} can not be deleted.`);
      return;
    }

    Storage.remove({key: storageKeyPrefix + name});
    this._ruleSets = this._ruleSets.filter(r => r.name !== name);
    this.ruleSetsSubject.next(this._ruleSets);
  }

  editRuleSet(name: string, newName: string, newConfig: RuleSetConfig) {
    if (name === defaultRuleSet.name) {
      console.error(`The rule set ${defaultRuleSet.name} can not be changed.`);
      return;
    }

    const index = this._ruleSets.findIndex(r => r.name === name);
    const ruleSet = new RuleSet(newName, newConfig);
    Storage.set({key: storageKeyPrefix + ruleSet.name, value: ruleSet.toJson()});
    Storage.remove({key: storageKeyPrefix + name});
    this._ruleSets[index] = ruleSet;
    this.ruleSetsSubject.next(this._ruleSets);
  }
}
