import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RuleSet } from 'src/app/domain/rule-set';
import { MessagesService } from 'src/app/services/messages.service';
import { defaultRuleSet, RuleSetsService } from 'src/app/services/rule-sets.service';

@Component({
  selector: 'app-rule-set',
  templateUrl: './rule-set.page.html',
  styleUrls: ['./rule-set.page.scss']
})
export class RuleSetPage implements OnInit, OnDestroy {
  defaultRuleSetName = defaultRuleSet.name;

  ruleSets: RuleSet[];
  displayRuleSetDetail: { [name: string]: boolean } = {};
  private ruleSetsSubscription: Subscription;

  constructor(
    private messages: MessagesService,
    private ruleSetsService: RuleSetsService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.ruleSetsSubscription = this.ruleSetsService.ruleSets.subscribe(ruleSets => {
      this.ruleSets = ruleSets;
      ruleSets
        .map(r => r.name)
        .forEach(name => {
          if (!(name in this.displayRuleSetDetail)) {
            this.displayRuleSetDetail[name] = false;
          }
        });
    });
  }

  ngOnDestroy() {
    this.ruleSetsSubscription.unsubscribe();
  }

  onCardClick(ruleSet: RuleSet) {
    this.displayRuleSetDetail[ruleSet.name] = !this.displayRuleSetDetail[ruleSet.name];
  }

  onButtonClick(event: MouseEvent, action: 'delete' | 'copy' | 'edit' | 'newList', ruleSet: RuleSet) {
    event.stopPropagation();
    switch (action) {
      case 'delete':
        this.deleteRuleSet(ruleSet);
        break;
      case 'copy':
        this.router.navigate(['/rule-set/create'], {queryParams: {basedOn: ruleSet.name}});
        break;
      case 'edit':
        this.router.navigate(['/rule-set/edit', ruleSet.name]);
        break;
      case 'newList':
        this.router.navigate(['/lists/create'], {queryParams: {selected: ruleSet.name}});
        break;
      default:
        throw new Error(`Unknown action ${action}`);
    }
  }

  async deleteRuleSet(ruleSet: RuleSet) {
    const alert = await this.alertController.create({
      header: this.messages.get('deletePromptHeader', this.messages.get('ruleSet')),
      message: this.messages.get('deletePromptMessage', `${this.messages.get('ruleSet')} '${ruleSet.name}'`),
      buttons: [
        {
          text: this.messages.get('cancel'),
          role: 'cancel'
        },
        {
          text: this.messages.get('delete'),
          cssClass: 'danger',
          handler: () => this.ruleSetsService.deleteRuleSet(ruleSet.name)
        }
      ]
    });

    await alert.present();
  }
}
