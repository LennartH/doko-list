import { Component, OnInit, Input } from '@angular/core';
import { GameList } from 'src/app/domain/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-list-card',
  templateUrl: './game-list-card.component.html',
  styleUrls: ['./game-list-card.component.scss'],
})
export class GameListCardComponent implements OnInit {
  @Input() list: GameList;

  constructor(private router: Router) {}

  ngOnInit() {}

  score(player: string): number {
    return this.list.finalScores[player].total;
  }

  isWinner(player: string): boolean {
    return player === this.list.winner;
  }

  onClick() {
    this.router.navigate(['/lists/detail', this.list.id]);
  }
}
