import { Injectable } from '@angular/core';
import { $enum } from 'ts-enum-util';
import { AnnouncementBehaviour, BonusScore, BockroundAfter } from '../domain/common';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private readonly messages: {[key: string]: string};

  constructor() {
    this.messages = {
      re: 'Re',
      contra: 'Contra'
    };
    $enum(AnnouncementBehaviour).forEach(value => {
      this.messages[value] = $enum.mapValue(value).with({
        FirstGetsPlusTwo: 'Ansage +2, Absagen +1',
        AllDouble: 'An- und Absagen verdoppeln',
        FirstDoubles: 'Ansage verdoppelt, Absagen +1'
      });
    });
    $enum(BonusScore).forEach(value => {
      this.messages[value] = $enum.mapValue(value).with({
        WhenWinningAgainstDames: 'Gegen die Alten',
        ForDoppelkopf: 'Doppelkopf',
        ForCaughtFox: 'Fuchs gefangen',
        ForCaughtCharlie: 'Karlchen gefangen',
        WhenCharlieTakesLastTrick: 'Letzter Stich mit Karlchen',
        WhenFoxTakesLastTrick: 'Letzter Stich mit Fuchs',
        WhenDulleCapturesDulle: 'Dulle gefangen'
      });
    });
    $enum(BockroundAfter).forEach(value => {
      this.messages[value] = $enum.mapValue(value).with({
        Solo: 'Solo',
        LostAnnouncement: 'Verlorener Ansage',
        ScoreTie: 'Gleichstand',
        WonSchwarz: 'Schwarz gewonnen',
        ZeroScore: 'Null-Spiel'
      });
    });
  }

  get(key: string): string {
    const message = this.messages[key];
    if (message === undefined) {
      throw new Error(`Unknown message key ${key}`);
    }
    return message;
  }
}
