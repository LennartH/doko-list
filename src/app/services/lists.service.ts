import { Injectable } from '@angular/core';
import { GameList } from '../domain/list';
import { BehaviorSubject, Observable } from 'rxjs';
import { RuleSetConfig } from '../domain/rule-set';
import { take, map } from 'rxjs/operators';

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

  addList(id: string, players: string[], ruleSetConfig: RuleSetConfig) {
    this._lists.push(new GameList(id, players, ruleSetConfig));
    this.listsSubject.next(this._lists);
  }

  deleteList(id: string) {
    this._lists = this._lists.filter(l => l.id !== id);
    this.listsSubject.next(this._lists);
  }
}
