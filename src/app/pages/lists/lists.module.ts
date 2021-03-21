import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListsRoutingModule } from './lists-routing.module';
import { ListsComponent } from './lists.component';

@NgModule({
  declarations: [ListsComponent],
  imports: [CommonModule, ListsRoutingModule],
})
export class ListsModule {}
