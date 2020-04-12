import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from 'src/app/services/lists.service';
import { GameList } from 'src/app/domain/list';
import { ModalController } from '@ionic/angular';
import { AddRoundModalComponent } from 'src/app/components/add-round-modal/add-round-modal.component';

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
    private modalController: ModalController
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

  async onAddRound() {
    const modal = await this.modalController.create({
      component: AddRoundModalComponent,
      componentProps: {list: this.list}

    });
    modal.present();
  }
}
