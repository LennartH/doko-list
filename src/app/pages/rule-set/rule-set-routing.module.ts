import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuleSetPage } from './rule-set.page';

const routes: Routes = [
  {
    path: '',
    component: RuleSetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuleSetPageRoutingModule {}
