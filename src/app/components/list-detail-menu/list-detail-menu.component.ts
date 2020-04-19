import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GameList } from 'src/app/domain/list';
import { RuleSetCardComponent } from '../rule-set-card/rule-set-card.component';

@Component({
  selector: 'app-list-detail-menu',
  templateUrl: './list-detail-menu.component.html',
  styleUrls: ['./list-detail-menu.component.scss'],
})
export class ListDetailMenuComponent implements OnInit {

  @Input() list: GameList;

  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  async onRulesClicked() {
    this.popoverController.dismiss();
    const popover = await this.popoverController.create({
      component: RuleSetCardComponent,
      componentProps: {
        ruleSet: this.list.ruleSet,
        button: false
      },
      cssClass: 'wide-popover card-popover'
    });
    popover.present();
  }

}
