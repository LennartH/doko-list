import { Announcement, Party } from './common';

export interface RoundData {
  wasSolo: boolean;
  points: { re: number; contra: number };
  announcements: { re?: Announcement; contra?: Announcement };

  doppelkopfs: Party[];
  charliesCaught: [Party?, Party?];
  charlyGotLastTrick?: Party;
  foxesCaught: [Party?, Party?];
  foxGotLastTrick?: Party;
  dulleCaughtDulle?: Party;
}

class RoundDataBuilder {

  private wasSolo = false;
  private points = {re: 0, contra: 0};
  private announcements: { re?: Announcement; contra?: Announcement } = {};
  private doppelkopfs: Party[] = [];
  private charliesCaught: [Party?, Party?] = [];
  private charlyGotLastTrick: Party = undefined;
  private foxesCaught: [Party?, Party?] = [];
  private foxGotLastTrick: Party = undefined;
  private dulleCaughtDulle: Party = undefined;

  solo(wasSolo: boolean = true): RoundDataBuilder {
    this.wasSolo = wasSolo;
    return this;
  }

  withRePoints(points: number): RoundDataBuilder {
    this.points.re = points;
    this.points.contra = 240 - points;
    return this;
  }

  withContraPoints(points: number): RoundDataBuilder {
    this.points.contra = points;
    this.points.re = 240 - points;
    return this;
  }

  withReAnnouncement(announcement: Announcement): RoundDataBuilder {
    this.announcements.re = announcement;
    return this;
  }

  withContraAnnouncement(announcement: Announcement): RoundDataBuilder {
    this.announcements.contra = announcement;
    return this;
  }

  withDoppelkopfsBy(...parties: Party[]): RoundDataBuilder {
    this.doppelkopfs.push(...parties);
    return this;
  }

  charlyCaughtBy(first: Party, second?: Party): RoundDataBuilder {
    this.charliesCaught = [first, second];
    return this;
  }

  lastTrickWithCharlyBy(party: Party): RoundDataBuilder {
    this.charlyGotLastTrick = party;
    this.foxGotLastTrick = undefined;
    return this;
  }

  foxCaughtBy(first: Party, second?: Party): RoundDataBuilder {
    this.foxesCaught = [first, second];
    return this;
  }

  lastTrickWithFoxBy(party: Party): RoundDataBuilder {
    this.foxGotLastTrick = party;
    this.charlyGotLastTrick = undefined;
    return this;
  }

  dulleCapturedBy(party: Party): RoundDataBuilder {
    this.dulleCaughtDulle = party;
    return this;
  }

  build(): RoundData {
    return {
      wasSolo: this.wasSolo,
      points: {...this.points},
      announcements: {...this.announcements},
      doppelkopfs: [...this.doppelkopfs],
      charliesCaught: [this.charliesCaught[0], this.charliesCaught[1]],
      charlyGotLastTrick: this.charlyGotLastTrick,
      foxesCaught: [this.foxesCaught[0], this.foxesCaught[1]],
      foxGotLastTrick: this.foxGotLastTrick,
      dulleCaughtDulle: this.dulleCaughtDulle
    };
  }
}

// tslint:disable-next-line: no-namespace
export namespace RoundData {
  export function create(): RoundDataBuilder {
    return new RoundDataBuilder();
  }
}
