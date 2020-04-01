import { Injectable } from '@angular/core';
import { GameList } from '../domain/list';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { RuleSetConfig } from '../domain/rule-set';
import { take, map, delayWhen } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

const storageKeyPrefix = 'list/';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  private _lists: GameList[] = [];
  private listsSubject = new BehaviorSubject<GameList[]>(this._lists);

  private isInitialized = false;

  constructor() {
    Storage.keys().then(({ keys }) => {
      Promise.all(
        keys.filter(k => k.startsWith(storageKeyPrefix))
            .map(key => Storage.get({ key }))
      ).then(values => {
        this._lists = values.map(v => GameList.fromJson(v.value));
        this.isInitialized = true;
        this.listsSubject.next(this._lists);
      });
    });
  }

  get lists(): Observable<GameList[]> {
    return this.listsSubject.asObservable();
  }

  list(id: string): Observable<GameList> {
    return this.lists.pipe(
      delayWhen(() => this.isInitialized ? interval(0) : interval(500)),
      take(1),
      map(lists => lists.find(l => l.id === id))
    );
  }

  addList(players: string[], ruleSetName: string, ruleSetConfig: RuleSetConfig): string {
    const id = uuid.v4();
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const list = new GameList(id, startDate, players, ruleSetName, ruleSetConfig);
    Storage.set({key: storageKeyPrefix + id, value: list.toJson()});
    this._lists.push(list);
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
