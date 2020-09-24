import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { GameList } from 'src/app/domain/list';
import { ListsService } from 'src/app/services/lists.service';
import { AddRoundModalComponent } from './components/add-round-modal/add-round-modal.component';
import { ListDetailMenuComponent } from './components/list-detail-menu/list-detail-menu.component';
import { RoundDetailsCardComponent } from './components/round-details-card/round-details-card.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  list: GameList;
  isGridOverflowing = false;

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

  ionViewDidEnter() {
    setTimeout(() => this.updateIsGridOverflowing(), 1);
  }

  private updateIsGridOverflowing() {
    const grid = document.querySelector('#main-grid') as HTMLElement;
    if (!grid) {
      this.isGridOverflowing = false;
    } else {
      const gridBounds = grid.getBoundingClientRect();
      const containerBounds = grid.parentElement.getBoundingClientRect();
      this.isGridOverflowing = gridBounds.top < containerBounds.top || gridBounds.bottom > containerBounds.bottom;
    }
  }

  isDealer(player: string): boolean {
    const playerIndex = this.countNonSoloRounds() % 4;
    return player === this.list.players[playerIndex];
  }

  isStartOfCycle(roundNumber: number): boolean {
    return this.countNonSoloRounds(roundNumber) % 4 === 0;
  }

  private countNonSoloRounds(until?: number): number {
    if (until === undefined) {
      until = this.list.rounds.length;
    }

    let nonSoloRounds = 0;
    for (let i = 0; i < until && i < this.list.rounds.length; i++) {
      if (!this.list.rounds[i].roundData.wasSolo) {
        nonSoloRounds++;
      }
    }
    return nonSoloRounds;
  }

  wasSolo(roundNumber: number): boolean {
    return this.list.rounds[roundNumber]?.roundData.wasSolo;
  }

  wasBockround(roundNumber: number): boolean {
    return this.list.rounds[roundNumber - 1]?.result.isBockroundNext;
  }

  async onMenuClicked(event: any) {
    const popover = await this.popoverController.create({
      component: ListDetailMenuComponent,
      componentProps: { list: this.list },
      showBackdrop: false,
      event,
    });
    popover.present();
  }

  async onAddRound() {
    const modal = await this.modalController.create({
      component: AddRoundModalComponent,
      componentProps: { list: this.list },
    });
    modal.present();
    modal.onDidDismiss().then(() => setTimeout(() => this.updateIsGridOverflowing(), 1));
  }

  // TODO Move to round row detail component
  async displayRoundDetails(roundNumber: number) {
    const popover = await this.popoverController.create({
      component: RoundDetailsCardComponent,
      componentProps: {
        roundNumber,
        round: this.list.rounds[roundNumber],
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
        roundNumber,
      },
    });
    modal.present();
  }

  async deleteRound(roundNumber: number) {
    const alert = await this.alertController.create({
      header: 'Runde Löschen?',
      message: `Runde ${roundNumber + 1} wirklich dauerhaft löschen?`,
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Löschen',
          cssClass: 'danger',
          handler: () => {
            this.list.removeRound(roundNumber);
            this.listsService.saveList(this.list.id);
            setTimeout(() => this.updateIsGridOverflowing(), 1);
          },
        },
      ],
    });
    this.popoverController.dismiss();
    alert.present();
  }
}
