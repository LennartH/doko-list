import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuleSetPage } from './rule-set.page';

const routes: Routes = [
  {
    path: '',
    component: RuleSetPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'edit/:ruleSetName',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuleSetPageRoutingModule {}
