import { Injectable } from '@angular/core';
import { $enum } from 'ts-enum-util';
import { AnnouncementBehaviour, BockroundAfter, BonusScore } from '../domain/common';

export interface Message {
  key: string;
  args?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private readonly variablePrefix = '$';

  private readonly messages: { [key: string]: string };

  constructor() {
    this.messages = {
      appTitle: 'Doppelkopf Listen',

      cancel: 'Abbrechen',
      delete: 'Löschen',
      copy: 'Kopieren',
      edit: 'Ändern',
      done: 'Fertig',
      end: 'Beenden',
      none: 'Keine',

      deletePromptHeader: '{0} Löschen?',
      deletePromptMessage: '{0} endgültig löschen?',

      list: 'Liste',
      lists: 'Listen',
      yourLists: 'Deine Listen',
      noListsAvailable: 'Keine Listen vorhanden',
      noActiveListsAvailable: 'Keine aktiven Listen vorhanden',
      activeLists: 'Aktive Listen',
      finishedLists: 'Abgeschlossene Listen',
      startNewList: 'Neue Liste beginnen',
      newList: 'Neue Liste',
      player: 'Spieler',
      duplicatedPlayerNamesError: 'Die Spielernamen müssen eindeutig sein.',
      rules: 'Regeln',
      endList: 'Liste beenden',
      listOfThe: 'Liste vom',
      noRoundAdded: 'Keine Runden eingetragen',
      addRound: 'Runde hinzufügen',
      round: 'Runde',
      roundNumber: 'Runde {0}',
      endListPromptHeader: 'Liste Beenden?',
      endListPromptMessage: 'Liste wirklich beenden? Danach können keine weiteren Runden hinzugefügt werden.',
      newRound: 'Neue Runde',
      editRound: 'Runde {0} Ändern',
      parties: 'Parteien',
      points: 'Punkte',
      eyes: 'Augen',
      announcements: 'An- und Absagen',
      bonusScores: 'Sonderpunkte',
      doppelkopf: 'Doppelkopf',

      ruleSet: 'Regelsatz',
      ruleSets: 'Regelsätze',
      newRuleSet: 'Neuer Regelsatz',
      editRuleSet: 'Regelsatz Bearbeiten',

      re: 'Re',
      contra: 'Contra',
      schwarz: 'Schwarz',
      won: 'Gewonnen',
      bockround: 'Bockrunde',
      bockrounds: 'Bockrunden',

      noAnnouncementBy: 'Keine Ansage von {0}',
      noAnnouncement: 'Keine Absage',
      partyAnnounced: '{0} angesagt',
      partyAnnouncedLost: '{0} Ansage verloren',
      lessThanThreshold: 'Keine {0}',
      lessThanThresholdAnnounced: 'Keine {0} angesagt',
      lessThanThresholdAnnouncedLost: 'Keine {0} Absage verloren',
      lessThan0: 'Schwarz',
      lessThan0Announced: 'Schwarz angesagt',
      lessThan0AnnouncedLost: 'Schwarz Ansage verloren',

      groups: 'Gruppen',
    };

    $enum(AnnouncementBehaviour).forEach((value) => {
      this.messages[value] = $enum.mapValue(value).with({
        FirstGetsPlusTwo: 'Ansage +2, Absagen +1',
        AllDouble: 'An- und Absagen verdoppeln',
        FirstDoubles: 'Ansage verdoppelt, Absagen +1',
      });
    });
    $enum(BonusScore).forEach((value) => {
      this.messages[value] = $enum.mapValue(value).with({
        WhenWinningAgainstDames: 'Gegen die Alten',
        ForDoppelkopf: 'Doppelkopf',
        ForCaughtFox: 'Fuchs gefangen',
        ForCaughtCharlie: 'Karlchen gefangen',
        WhenCharlieTakesLastTrick: 'Letzter Stich mit Karlchen',
        WhenFoxTakesLastTrick: 'Letzter Stich mit Fuchs',
        WhenDulleCapturesDulle: 'Dulle gefangen',
      });
    });
    $enum(BockroundAfter).forEach((value) => {
      this.messages[value] = $enum.mapValue(value).with({
        Solo: 'Solo',
        LostAnnouncement: 'Verlorener Ansage',
        ScoreTie: 'Gleichstand',
        WonSchwarz: 'Schwarz gewonnen',
        ZeroScore: 'Null-Spiel',
      });
    });
  }

  get(keyOrMessage: string | Message, ...args: any[]): string {
    let key: string;
    if (typeof keyOrMessage === 'string') {
      key = keyOrMessage;
    } else {
      key = keyOrMessage.key;
      const messageArgsIsObject = this.areArgsSingleObject(keyOrMessage.args);
      const argsIsObject = this.areArgsSingleObject(args);
      const useObject = messageArgsIsObject || argsIsObject;
      const args1 = messageArgsIsObject ? keyOrMessage.args[0] : keyOrMessage.args;
      const args2 = argsIsObject ? args[0] : args;
      args = useObject ? [{ ...args1, ...args2 }] : [...args1, ...args2];
    }

    const message = this.messages[key];
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

    if (this.areArgsSingleObject(args)) {
      args = args[0];
      const keys = Object.keys(args);
      const regex = /{(\d?[a-zA-Z]\w*)}|{(\d+)}/gi;
      return message.replace(regex, (match, key, number) => {
        let arg: any;
        if (key && key in args) {
          arg = args[key];
        }
        if (number && number < keys.length) {
          arg = args[keys[Number(number)]];
        }

        if (arg) {
          return this.argReplacement(arg);
        } else {
          return match;
        }
      });
    } else {
      return message.replace(/{(\d+)}/gi, (match, number) => {
        number = Number(number);
        return number in args ? this.argReplacement(args[number]) : match;
      });
    }
  }

  private argReplacement(arg: any): string {
    if (typeof arg !== 'string') {
      return arg;
    }
    if (!arg.startsWith(this.variablePrefix)) {
      return arg.replace(/^\\\$/, '$');
    }

    return this.get(arg.substr(1));
  }

  private areArgsSingleObject(args: any[]): boolean {
    if (!args || args.length !== 1) {
      return false;
    }
    return typeof args[0] === 'object';
  }
}
