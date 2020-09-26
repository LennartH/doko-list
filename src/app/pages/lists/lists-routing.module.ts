import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListsPage } from './lists.page';

const routes: Routes = [
  {
    path: '',
    component: ListsPage,
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then((m) => m.CreatePageModule),
  },
  {
    path: 'detail/:listId',
    loadChildren: () => import('./detail/detail.module').then((m) => m.DetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListsPageRoutingModule {}
