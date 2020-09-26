import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Party, PointThreshold } from 'src/app/domain/common';
import { RoundData } from 'src/app/domain/round-data';
import { RuleSetConfig } from 'src/app/domain/rule-set';
import { MessagesService } from 'src/app/services/messages.service';
import { PartyAnnouncementComponent } from '../../controls/party-announcement/party-announcement.component';

@Component({
  selector: 'app-round-data-form',
  templateUrl: './round-data-form.component.html',
  styleUrls: ['./round-data-form.component.scss'],
})
export class RoundDataFormComponent implements OnInit, AfterViewInit {
  @Input() ruleSetConfig: RuleSetConfig;
  @Input() isSolo: boolean;
  @Input() consecutiveBockrounds: number;

  @Input() initialRoundData?: RoundData;

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

  ngOnInit() {
    if (this.initialRoundData) {
      this.rePoints = this.initialRoundData.points.re;
      this.doppelkopfs.re = this.initialRoundData.doppelkopfs.filter((p) => p === 're').length;
      this.doppelkopfs.contra = this.initialRoundData.doppelkopfs.filter((p) => p === 'contra').length;
      this.foxesCaught = [this.initialRoundData.foxesCaught[0], this.initialRoundData.foxesCaught[1]];
      this.foxGotLastTrick = this.initialRoundData.foxGotLastTrick;
      this.charliesCaught = [this.initialRoundData.charliesCaught[0], this.initialRoundData.charliesCaught[1]];
      this.charlyGotLastTrick = this.initialRoundData.charlyGotLastTrick;
      this.dulleCaughtDulle = this.initialRoundData.dulleCaughtDulle;
    }
  }

  ngAfterViewInit() {
    if (this.initialRoundData) {
      if (this.initialRoundData.announcements.re) {
        this.reAnnouncement.victoryAnnounced = true;
        if (this.initialRoundData.announcements.re.lessThan < 120) {
          this.reAnnouncement.threshold = this.initialRoundData.announcements.re.lessThan;
        }
      }
      if (this.initialRoundData.announcements.contra) {
        this.contraAnnouncement.victoryAnnounced = true;
        if (this.initialRoundData.announcements.contra.lessThan < 120) {
          this.contraAnnouncement.threshold = this.initialRoundData.announcements.contra.lessThan;
        }
      }
    }
  }

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
    const caughtAndLastTrickDiffer = !this.charlyGotLastTrick || !this.charliesCaught.some((p) => p === this.charlyGotLastTrick);
    return lessThanThreeCharlies && caughtAndLastTrickDiffer;
  }

  get value(): RoundData {
    if (this.invalid) {
      return undefined;
    }

    const doppelkopfs: Party[] = [];
    for (let i = 0; i < this.doppelkopfs.re; i++) {
      doppelkopfs.push('re');
    }
    for (let i = 0; i < this.doppelkopfs.contra; i++) {
      doppelkopfs.push('contra');
    }

    const announcements = {
      re: this.reAnnouncement.value,
      contra: this.contraAnnouncement.value,
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
