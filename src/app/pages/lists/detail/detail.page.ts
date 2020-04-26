import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from 'src/app/services/lists.service';
import { GameList } from 'src/app/domain/list';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { AddRoundModalComponent } from 'src/app/components/add-round-modal/add-round-modal.component';
import { ListDetailMenuComponent } from 'src/app/components/list-detail-menu/list-detail-menu.component';
import { RoundDetailsCardComponent } from 'src/app/components/round-details-card/round-details-card.component';
import { RoundData } from 'src/app/domain/round-data';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  list: GameList;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listsService: ListsService,
    private router: Router,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (!('listId' in params)) {
        this.router.navigateByUrl('/lists');
      }
      this.listsService.list(params.listId).subscribe((list) => {
        if (list === undefined) {
          this.router.navigateByUrl('/lists');
        }
        this.list = list;
      });
    });
  }

  wasSolo(roundNumber: number): boolean {
    return this.list.rounds[roundNumber].roundData.wasSolo;
  }

  wasBockround(roundNumber: number): boolean {
    return this.list.rounds[roundNumber - 1]?.result.isBockroundNext;
  }

  async onMenuClicked(event: any) {
    const popover = await this.popoverController.create({
      component: ListDetailMenuComponent,
      componentProps: {list: this.list},
      showBackdrop: false,
      event
    });
    popover.present();
  }

  async onAddRound() {
    const modal = await this.modalController.create({
      component: AddRoundModalComponent,
      componentProps: {list: this.list}

    });
    modal.present();
  }

  async displayRoundDetails(roundNumber: number) {
    this.popoverController.dismiss();
    const popover = await this.popoverController.create({
      component: RoundDetailsCardComponent,
      componentProps: {
        roundNumber,
        round: this.list.rounds[roundNumber]
      },
      cssClass: 'broad-popover card-popover',
    });
    popover.present();
  }

  async editRound(roundNumber: number) {
    const modal = await this.modalController.create({
      component: AddRoundModalComponent,
      componentProps: {
        list: this.list,
        roundNumber
      }
    });
    modal.present();
  }

  async deleteRound(roundNumber: number) {
    const alert = await this.alertController.create({
      header: 'Runde Löschen?',
      message: 'Runde wirklich dauerhaft löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          cssClass: 'danger',
          handler: () => {
            this.list.removeRound(roundNumber);
            this.listsService.saveList(this.list.id);
          }
        }
      ]
    });
    this.popoverController.dismiss();
    alert.present();
  }
}
