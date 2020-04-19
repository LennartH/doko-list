import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from 'src/app/services/lists.service';
import { GameList } from 'src/app/domain/list';
import { ModalController, PopoverController } from '@ionic/angular';
import { AddRoundModalComponent } from 'src/app/components/add-round-modal/add-round-modal.component';
import { ListDetailMenuComponent } from 'src/app/components/list-detail-menu/list-detail-menu.component';

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
    private popoverController: PopoverController
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
}
