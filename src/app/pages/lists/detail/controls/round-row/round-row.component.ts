import { Component, OnInit, Input } from '@angular/core';
import { DetailPage } from 'src/app/pages/lists/detail/detail.page';
import { GameList } from 'src/app/domain/list';

@Component({
  selector: 'app-round-row',
  templateUrl: './round-row.component.html',
  styleUrls: ['./round-row.component.scss'],
})
export class RoundRowComponent implements OnInit {

  @Input() roundNumber: number;
  @Input() list: GameList;
  @Input() points: { [player: string]: { total: number; delta: number } };

  constructor(private listDetailsPage: DetailPage) { }

  ngOnInit() {}

  get players(): string[] {
    return this.list.players;
  }

  get isLast(): boolean {
    return this.list.rounds.length === this.roundNumber + 1;
  }

  get wasSolo(): boolean {
    return this.list.rounds[this.roundNumber]?.roundData.wasSolo;
  }

  get wasBockround(): boolean {
    return this.list.rounds[this.roundNumber - 1]?.result.isBockroundNext;
  }

  async displayRoundDetails() {
    this.listDetailsPage.displayRoundDetails(this.roundNumber);
  }

  async editRound() {
    this.listDetailsPage.editRound(this.roundNumber);
  }

  async deleteRound() {
    this.listDetailsPage.deleteRound(this.roundNumber);
  }

}
