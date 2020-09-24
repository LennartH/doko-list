import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameList } from 'src/app/domain/list';
import { ListsService } from 'src/app/services/lists.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit, OnDestroy {
  activeLists: GameList[];
  finishedLists: GameList[];
  private listsSubscription: Subscription;

  constructor(private listsService: ListsService) {}

  ngOnInit() {
    this.listsSubscription = this.listsService.lists.subscribe((lists) => {
      this.activeLists = lists.filter((l) => !l.isFinished).sort((l1, l2) => l2.startDate.getTime() - l1.startDate.getTime());
      this.finishedLists = lists.filter((l) => l.isFinished).sort((l1, l2) => l2.endDate.getTime() - l1.endDate.getTime());
    });
  }

  ngOnDestroy() {
    this.listsSubscription?.unsubscribe();
  }
}
