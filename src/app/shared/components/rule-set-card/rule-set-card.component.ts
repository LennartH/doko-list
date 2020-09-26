import { Component, Input, OnInit } from '@angular/core';
import { RuleSet } from 'src/app/domain/rule-set';

@Component({
  selector: 'app-rule-set-card',
  templateUrl: './rule-set-card.component.html',
  styleUrls: ['./rule-set-card.component.scss'],
})
export class RuleSetCardComponent implements OnInit {
  @Input() ruleSet: RuleSet;
  @Input() button: boolean;

  constructor() {}

  ngOnInit() {}
}
