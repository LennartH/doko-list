import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RuleSet } from '../domain/rule-set';

@Injectable({
  providedIn: 'root'
})
export class RuleSetsService {

  private _ruleSets: RuleSet[] = [];
  private ruleSetsSubject = new BehaviorSubject<RuleSet[]>(this._ruleSets);

  constructor() { }

  get ruleSets(): Observable<RuleSet[]> {
    return this.ruleSetsSubject.asObservable();
  }
}
