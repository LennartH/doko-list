import { Injectable } from '@angular/core';
import { GameList } from '../domain/list';
import { BehaviorSubject, Observable } from 'rxjs';
import { RuleSetConfig } from '../domain/rule-set';
import { take, map } from 'rxjs/operators';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  private _lists: GameList[] = [];
  private listsSubject = new BehaviorSubject<GameList[]>(this._lists);

  constructor() { }

  get lists(): Observable<GameList[]> {
    return this.listsSubject.asObservable();
  }

  list(id: string): Observable<GameList> {
    return this.lists.pipe(take(1), map(lists => lists.find(l => l.id === id)));
  }

  addList(players: string[], ruleSetName: string, ruleSetConfig: RuleSetConfig): string {
    const id = uuid.v4();
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    this._lists.push(new GameList(id, startDate, players, ruleSetName, ruleSetConfig));
    this.listsSubject.next(this._lists);
    return id;
  }

  finishList(id: string) {
    const list = this._lists.find(l => l.id === id);
    if (list === undefined || list.endDate !== undefined) {
      return;
    }
    list.endDate = new Date();
    list.endDate.setHours(0, 0, 0, 0);
    this.listsSubject.next(this._lists);
  }

  deleteList(id: string) {
    this._lists = this._lists.filter(l => l.id !== id);
    this.listsSubject.next(this._lists);
  }
}
