export type Party = 're' | 'contra';
// tslint:disable-next-line: no-namespace
export namespace Party {
    export function values(): Party[] {
        return ['re', 'contra'];
    }
}

export type PointThreshold = 0 | 30 | 60 | 90 | 120;
// tslint:disable-next-line: no-namespace
export namespace PointThreshold {
    export function values(): PointThreshold[] {
        return [0, 30, 60, 90, 120];
    }
}

export interface Announcement {
    lessThan: PointThreshold;
}

export enum BockroundAfter {
  ScoreTie = 'ScoreTie',
  WonSchwarz = 'WonSchwarz',
  LostAnnouncement = 'LostAnnouncement',
  ZeroScore = 'ZeroScore',
  Solo = 'Solo'
}

export enum BonusScore {
    WhenWinningAgainstDames = 'WhenWinningAgainstDames',
    ForDoppelkopf = 'ForDoppelkopf',
    ForCaughtFox = 'ForCaughtFox',
    WhenCharlieTakesLastTrick = 'WhenCharlieTakesLastTrick',
    ForCaughtCharlie = 'ForCaughtCharlie',
    WhenFoxTakesLastTrick = 'WhenFoxTakesLastTrick',
    WhenDulleCapturesDulle = 'WhenDulleCapturesDulle'
}

export enum AnnouncementBehaviour {
    FirstGetsPlusTwo = 'FirstGetsPlusTwo',
    FirstDoubles = 'FirstDoubles',
    AllDouble = 'AllDouble'
}
