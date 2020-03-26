import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RuleSetPageRoutingModule } from './rule-set-routing.module';

import { RuleSetPage } from './rule-set.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RuleSetPageRoutingModule
  ],
  declarations: [RuleSetPage]
})
export class RuleSetPageModule {}
