import { Component, OnInit } from '@angular/core';
import { RuleSet } from 'src/app/domain/rule-set';
import { RuleSetsService } from 'src/app/services/rule-sets.service';

@Component({
  selector: 'app-rule-set',
  templateUrl: './rule-set.page.html',
  styleUrls: ['./rule-set.page.scss'],
})
export class RuleSetPage implements OnInit {

  ruleSets: RuleSet[];

  constructor(
    private ruleSetsService: RuleSetsService
  ) { }

  ngOnInit() {
    this.ruleSetsService.ruleSets.subscribe(ruleSets => this.ruleSets = ruleSets);
  }

}
