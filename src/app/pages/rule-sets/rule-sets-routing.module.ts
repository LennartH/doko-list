import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuleSetsComponent } from './rule-sets.component';

const routes: Routes = [{ path: '', component: RuleSetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuleSetsRoutingModule {}
