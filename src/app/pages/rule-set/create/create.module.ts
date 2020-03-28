import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreatePageRoutingModule } from './create-routing.module';
import { CreatePage } from './create.page';




@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, CreatePageRoutingModule],
  declarations: [CreatePage]
})
export class CreatePageModule {}
