import { Component, OnInit, Input } from '@angular/core';
import { DetailPage } from 'src/app/pages/lists/detail/detail.page';

@Component({
  selector: 'app-round-row',
  templateUrl: './round-row.component.html',
  styleUrls: ['./round-row.component.scss'],
})
export class RoundRowComponent implements OnInit {

  @Input() roundNumber: number;
  @Input() isLast: boolean;
  @Input() wasSolo: boolean;
  @Input() wasBockround: boolean;

  @Input() players: string[];
  @Input() points: { [player: string]: { total: number; delta: number } };

  constructor(private listDetailsPage: DetailPage) { }

  ngOnInit() {}

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
