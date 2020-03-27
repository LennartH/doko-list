export interface RoundData {
    wasSolo: boolean;
    points: {re: number, contra: number};
    announcements: {re?: Announcement, contra?: Announcement};

    charliesCaught: [Party?, Party?];
    charlyGotLastTrick?: Party;
    foxGotLastTrick?: Party;
    dulleCaughtDulle?: Party;
}

export type Party = 're' | 'contra';
export type PointThreshold = 0 | 30 | 60 | 90 | 120;

export interface Announcement {
    lessThan: PointThreshold;
}

export enum BockroundAfter {
  ScoreTie,
  WonSchwarz,
  LostAnnouncement,
  ZeroPoints,
  Solo
}
