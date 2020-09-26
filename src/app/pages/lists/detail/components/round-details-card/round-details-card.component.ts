import { Component, Input, OnInit } from '@angular/core';
import { Round } from 'src/app/domain/list';

@Component({
  selector: 'app-round-details-card',
  templateUrl: './round-details-card.component.html',
  styleUrls: ['./round-details-card.component.scss'],
})
export class RoundDetailsCardComponent implements OnInit {
  @Input() roundNumber: number;
  @Input() round: Round;

  constructor() {}

  ngOnInit() {}
}
