import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Party } from 'src/app/domain/common';
import { GameList } from 'src/app/domain/list';
import { RoundDataFormComponent } from '../round-data-form/round-data-form.component';
import { MessagesService } from 'src/app/services/messages.service';
import { ListsService } from 'src/app/services/lists.service';
import { RoundResult } from 'src/app/domain/rule-set';

@Component({
  selector: 'app-add-round-modal',
  templateUrl: './add-round-modal.component.html',
  styleUrls: ['./add-round-modal.component.scss'],
})
export class AddRoundModalComponent implements OnInit {

  @Input() list: GameList;

  playerParties: {[player: string]: Party};
  @ViewChild('f') roundDataForm: RoundDataFormComponent;

  private rePlayersHistory: string[] = [];

  constructor(public messages: MessagesService, private modalController: ModalController, private listsService: ListsService) { }

  ngOnInit() {
    this.playerParties = Object.fromEntries(this.list.players.map(p => [p, 'contra']));
  }

  togglePlayerParty(player: string) {
    const currentParty = this.playerParties[player];
    if (currentParty === 'contra') {
      this.rePlayersHistory.push(player);
      this.playerParties[player] = 're';
      if (this.rePlayersHistory.length >= 3) {
        this.playerParties[this.rePlayersHistory.shift()] = 'contra';
      }
    } else {
      this.rePlayersHistory = this.rePlayersHistory.filter(p => p !== player);
      this.playerParties[player] = 'contra';
    }
  }

  get reCount(): number {
    return Object.values(this.playerParties).reduce((c, p) => c + (p === 're' ? 1 : 0), 0);
  }

  arePlayerPartiesValid(): boolean {
    const reCount = this.reCount;
    return reCount === 1 || reCount === 2;
  }

  calculateResult(): RoundResult {
    const roundData = this.roundDataForm?.value;
    if (roundData === undefined) {
      return undefined;
    }
    return this.list.ruleSet.calculateScore(roundData);
  }

  onConfirm() {
    if (this.roundDataForm.invalid || !this.arePlayerPartiesValid()) {
      return;
    }
    this.list.addRound(this.playerParties, this.roundDataForm.value);
    this.listsService.saveList(this.list.id);
    this.modalController.dismiss();
  }

  onCancel() {
    this.modalController.dismiss();
  }

}
