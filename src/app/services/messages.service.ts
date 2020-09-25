import { Injectable } from '@angular/core';
import { $enum } from 'ts-enum-util';
import { AnnouncementBehaviour, BonusScore, BockroundAfter, PointThreshold, Party } from '../domain/common';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private readonly messages: {[key: string]: string};

  constructor() {
    this.messages = {
      cancel: 'Abbrechen',
      delete: 'Löschen',
      copy: 'Kopieren',
      edit: 'Ändern',
      done: 'Fertig',
      
      newList: 'Neue Liste',
      ruleSets: 'Regelsätze',
      newRuleSet: 'Neuer Regelsatz',
      editRuleSet: 'Regelsatz Bearbeiten',
    
      deleteRuleSetHeader: "'{0}' Löschen?",
      deleteRuleSetPrompt: "Regelsatz '{0}' endgültig löschen?",
    
      re: 'Re',
      contra: 'Contra',
    
      schwarz: 'Schwarz',
      won: 'Gewonnen',
      reAnnounced: 'Re angesagt',
      reAnnouncedLost: 'Re Ansage verloren',
      contraAnnounced: 'Contra angesagt',
      contraAnnouncedLost: 'Contra Ansage verloren',
      bockround: 'Bockrunde',
      bockrounds: 'Bockrunden',
      lessThan0Announced: 'Schwarz angesagt',
      lessThan0AnnouncedLost: 'Schwarz Ansage verloren'
    };

    PointThreshold.values().slice(1, -1).forEach(threshold => {
      this.messages[`lessThan${threshold}`] = `Keine ${threshold}`;
      this.messages[`lessThan${threshold}Announced`] = `${threshold} abgesagt`;
      this.messages[`lessThan${threshold}AnnouncedLost`] = `Keine ${threshold} Absage verloren`;
    });

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

  get(key: string, ...args: any[]): string {
    let message = this.messages[key];
    if (message === undefined) {
      console.error(`Unknown message key ${key}`);
      return key;
    } else {
      return this.formatMessage(message, ...args);
    }
  }

  private formatMessage(message: string, ...args: any[]): string {
    if (args.length === 0) {
      return message;
    }

    const argsType = typeof args[0];
    if (argsType === 'string' || argsType === 'number') {
      return message.replace(/{(\d+)}/gi, (match, number) => {
        number = Number(number);
        return number in args ? args[number] : match;
      });
    } else {
      args = args[0];
      const keys = Object.keys(args);
      const regex = /{(\d?[a-zA-Z]\w*)}|{(\d+)}/gi;
      return message.replace(regex, (match, key, number) => {
        if (key && key in args) {
          return args[key];
        }
        if (number && number < keys.length) {
          return args[keys[Number(number)]];
        }
        return match;
      });
    }
  }
}
