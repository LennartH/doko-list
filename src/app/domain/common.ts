export type Party = 're' | 'contra';
export type PointThreshold = 0 | 30 | 60 | 90 | 120;

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

export enum ExtraScore {
    ForDoppelkopf = 'ForDoppelkopf',
    ForCaughtFox = 'ForCaughtFox',
    WhenCharlieTakesLastTrick = 'WhenCharlieTakesLastTrick',
    ForCaughtCharlie = 'ForCaughtCharlie',
    WhenFoxTakesLastTrick = 'WhenFoxTakesLastTrick',
    WhenDulleCapturesDulle = 'WhenDulleCapturesDulle'
}

export enum AnnouncementBehaviour {
    AllPlusOne = 'AllPlusOne',
    FirstGetsPlusTwo = 'FirstGetsPlusTwo',
    FirstDoubles = 'FirstDoubles',
    AllDouble = 'AllDouble'
}
