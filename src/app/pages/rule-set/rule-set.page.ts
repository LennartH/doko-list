import { Component, OnInit, OnDestroy } from '@angular/core';
import { RuleSet } from 'src/app/domain/rule-set';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { MessagesService } from 'src/app/services/messages.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rule-set',
  templateUrl: './rule-set.page.html',
  styleUrls: ['./rule-set.page.scss']
})
export class RuleSetPage implements OnInit, OnDestroy {
  ruleSets: RuleSet[];
  displayRuleSetDetail: { [name: string]: boolean } = {};
  private ruleSetsSubscription: Subscription;

  constructor(
    public messages: MessagesService,
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

  onButtonClick(event: MouseEvent, action: 'delete' | 'copy' | 'edit', ruleSet: RuleSet) {
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
      default:
        throw new Error(`Unknown action ${action}`);
    }
  }

  async deleteRuleSet(ruleSet: RuleSet) {
    const alert = await this.alertController.create({
      header: `'${ruleSet.name}' Löschen?`,
      message: `Regelsatz '${ruleSet.name}' endgültig löschen?`,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          cssClass: 'danger',
          handler: () => this.ruleSetsService.deleteRuleSet(ruleSet)
        }
      ]
    });

    await alert.present();
  }
}
