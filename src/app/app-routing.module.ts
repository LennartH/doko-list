import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  {
    path: 'groups',
    loadChildren: () => import('./pages/groups/groups.module').then((m) => m.GroupsModule),
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/lists/lists.module').then((m) => m.ListsModule),
  },
  {
    path: 'rule-sets',
    loadChildren: () => import('./pages/rule-sets/rule-sets.module').then((m) => m.RuleSetsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
