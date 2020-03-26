import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  {
    path: 'rule-set',
    loadChildren: () => import('./pages/rule-set/rule-set.module').then( m => m.RuleSetPageModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./pages/groups/groups.module').then( m => m.GroupsPageModule)
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/lists/lists.module').then( m => m.ListsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
