import { Component, OnInit, OnDestroy } from '@angular/core';
import { RuleSet } from 'src/app/domain/rule-set';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rule-set',
  templateUrl: './rule-set.page.html',
  styleUrls: ['./rule-set.page.scss'],
})
export class RuleSetPage implements OnInit, OnDestroy {

  ruleSets: RuleSet[];
  private ruleSetsSubscription: Subscription;

  constructor(
    public messages: MessagesService,
    private ruleSetsService: RuleSetsService
  ) { }

  ngOnInit() {
    this.ruleSetsSubscription = this.ruleSetsService.ruleSets.subscribe(ruleSets => this.ruleSets = ruleSets);
  }

  ngOnDestroy() {
    this.ruleSetsSubscription.unsubscribe();
  }

  click() {
    console.log('click')
  }

}
