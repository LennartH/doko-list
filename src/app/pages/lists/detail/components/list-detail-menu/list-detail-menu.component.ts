import { Component, Input, OnInit } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { GameList } from 'src/app/domain/list';
import { ListsService } from 'src/app/services/lists.service';
import { Router } from '@angular/router';
import { RuleSetCardComponent } from 'src/app/shared/components/rule-set-card/rule-set-card.component';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-list-detail-menu',
  templateUrl: './list-detail-menu.component.html',
  styleUrls: ['./list-detail-menu.component.scss'],
})
export class ListDetailMenuComponent implements OnInit {
  @Input() list: GameList;

  constructor(
    private popoverController: PopoverController,
    private alertController: AlertController,
    private listsService: ListsService,
    private router: Router,
    private messages: MessagesService
  ) {}

  ngOnInit() {}

  async onRulesClicked() {
    this.popoverController.dismiss();
    const popover = await this.popoverController.create({
      component: RuleSetCardComponent,
      componentProps: {
        ruleSet: this.list.ruleSet,
        button: false,
      },
      cssClass: 'wide-popover card-popover',
    });
    popover.present();
  }

  async onFinishClicked() {
    const alert = await this.alertController.create({
      header: this.messages.get('endListPromptHeader'),
      message: this.messages.get('endListPromptMessage'),
      buttons: [
        {
          text: this.messages.get('cancel'),
          role: 'cancel',
        },
        {
          text: this.messages.get('end'),
          cssClass: 'tertiary',
          handler: () => this.listsService.finishList(this.list.id),
        },
      ],
    });
    this.popoverController.dismiss();
    alert.present();
  }

  async onDeleteClicked() {
    const alert = await this.alertController.create({
      header: this.messages.get('deletePromptHeader', this.messages.get('list')),
      message: this.messages.get('deletePromptMessage', this.messages.get('list')),
      buttons: [
        {
          text: this.messages.get('cancel'),
          role: 'cancel',
        },
        {
          text: this.messages.get('delete'),
          cssClass: 'danger',
          handler: () => {
            this.listsService.deleteList(this.list.id);
            this.router.navigateByUrl('/lists');
          },
        },
      ],
    });
    this.popoverController.dismiss();
    alert.present();
  }
}
