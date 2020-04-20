import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PointThreshold, Party, BonusScore } from 'src/app/domain/common';
import { RoundData } from 'src/app/domain/round-data';
import { PartyAnnouncementComponent } from 'src/app/widgets/party-announcement/party-announcement.component';
import { MessagesService } from 'src/app/services/messages.service';
import { RuleSetConfig } from 'src/app/domain/rule-set';

@Component({
  selector: 'app-round-data-form',
  templateUrl: './round-data-form.component.html',
  styleUrls: ['./round-data-form.component.scss'],
})
export class RoundDataFormComponent implements OnInit {
  @Input() ruleSetConfig: RuleSetConfig;
  @Input() isSolo: boolean;
  @Input() consecutiveBockrounds: number;

  rePoints = 120;
  @ViewChild('reAnnouncement') reAnnouncement: PartyAnnouncementComponent;
  @ViewChild('contraAnnouncement') contraAnnouncement: PartyAnnouncementComponent;
  doppelkopfs = { re: 0, contra: 0 };
  foxesCaught: [Party?, Party?] = [undefined, undefined];
  foxGotLastTrick: Party | undefined = undefined;
  charliesCaught: [Party?, Party?] = [undefined, undefined];
  charlyGotLastTrick: Party | undefined = undefined;
  dulleCaughtDulle: Party | undefined = undefined;

  readonly noParty = '-';

  private partyRotation: Party[] = [undefined, 're', 'contra'];

  constructor(public messages: MessagesService) {}

  ngOnInit() {}

  get pointThresholds(): number[] {
    return PointThreshold.values().reverse();
  }

  isBonusScore(bonusScore: string): boolean {
    return this.ruleSetConfig.bonusScoreRules.some((b) => b === bonusScore);
  }

  rotateDoppelkopfs(party: Party) {
    this.doppelkopfs[party] += 1;
    if (this.doppelkopfs[party] > 4) {
      this.doppelkopfs[party] = 0;
    }
  }

  rotateParty(key: 'charlyCaught' | 'foxCaught' | 'charlyGotLastTrick' | 'foxGotLastTrick' | 'dulleCaughtDulle', index?: number) {
    switch (key) {
      case 'charlyCaught':
        this.charliesCaught[index] = this._rotateParty(this.charliesCaught[index]);
        break;
      case 'foxCaught':
        this.foxesCaught[index] = this._rotateParty(this.foxesCaught[index]);
        break;
      case 'charlyGotLastTrick':
        this.charlyGotLastTrick = this._rotateParty(this.charlyGotLastTrick);
        break;
      case 'foxGotLastTrick':
        this.foxGotLastTrick = this._rotateParty(this.foxGotLastTrick);
        break;
      case 'dulleCaughtDulle':
        this.dulleCaughtDulle = this._rotateParty(this.dulleCaughtDulle);
        break;
      default:
        throw new Error(`Unknown rotate party key ${key}`);
    }
  }

  private _rotateParty(party: Party | undefined): Party | undefined {
    let index = this.partyRotation.indexOf(party) + 1;
    if (index >= this.partyRotation.length) {
      index = 0;
    }
    return this.partyRotation[index];
  }

  get invalid(): boolean {
    return !this.valid;
  }

  get valid(): boolean {
    return this.doppelkopfsValid && this.foxesValid && this.charliesValid;
  }

  get doppelkopfsValid(): boolean {
    return this.doppelkopfs.re + this.doppelkopfs.contra <= 4;
  }

  get foxesValid(): boolean {
    return !this.foxesCaught[0] || !this.foxesCaught[1] || !this.foxGotLastTrick;
  }

  get charliesValid(): boolean {
    const lessThanThreeCharlies = !this.charliesCaught[0] || !this.charliesCaught[1] || !this.charlyGotLastTrick;
    const caughtAndLastTrickDiffer = !this.charlyGotLastTrick || !this.charliesCaught.some(p => p === this.charlyGotLastTrick);
    return lessThanThreeCharlies && caughtAndLastTrickDiffer;
  }

  get value(): RoundData {
    const doppelkopfs: Party[] = [];
    for (let i = 0; i < this.doppelkopfs.re; i++) {
      doppelkopfs.push('re');
    }
    for (let i = 0; i < this.doppelkopfs.contra; i++) {
      doppelkopfs.push('contra');
    }

    const announcements = {
      re: this.reAnnouncement.value,
      contra: this.contraAnnouncement.value
    };
    if (announcements.re === undefined) {
      delete announcements.re;
    }
    if (announcements.contra === undefined) {
      delete announcements.contra;
    }

    return {
      wasSolo: this.isSolo,
      consecutiveBockrounds: this.consecutiveBockrounds,
      points: { re: this.rePoints, contra: 240 - this.rePoints },
      announcements,

      doppelkopfs,
      foxesCaught: [this.foxesCaught[0], this.foxesCaught[1]],
      foxGotLastTrick: this.foxGotLastTrick,
      charliesCaught: [this.charliesCaught[0], this.charliesCaught[1]],
      charlyGotLastTrick: this.charlyGotLastTrick,
      dulleCaughtDulle: this.dulleCaughtDulle,
    };
  }
}
