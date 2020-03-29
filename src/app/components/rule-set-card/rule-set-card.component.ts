import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { RuleSet } from 'src/app/domain/rule-set';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rule-set-card',
  templateUrl: './rule-set-card.component.html',
  styleUrls: ['./rule-set-card.component.scss'],
})
export class RuleSetCardComponent implements OnInit {

  @Input() ruleSet: RuleSet;
  @Input() button: boolean;

  constructor() { }

  ngOnInit() {
  }

}
