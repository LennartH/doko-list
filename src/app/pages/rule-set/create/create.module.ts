import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatePageRoutingModule } from './create-routing.module';
import { CreatePage } from './create.page';

@NgModule({
  imports: [CommonModule, IonicModule, CreatePageRoutingModule, SharedModule],
  declarations: [CreatePage],
})
export class CreatePageModule {}
