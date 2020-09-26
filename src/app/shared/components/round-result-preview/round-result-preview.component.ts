import { Component, OnInit, Input } from '@angular/core';
import { RoundResult } from 'src/app/domain/rule-set';

@Component({
  selector: 'app-round-result-preview',
  templateUrl: './round-result-preview.component.html',
  styleUrls: ['./round-result-preview.component.scss'],
})
export class RoundResultPreviewComponent implements OnInit {
  @Input() result: RoundResult;

  constructor() {}

  ngOnInit() {}
}
