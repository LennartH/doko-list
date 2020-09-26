import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { RuleSetPageRoutingModule } from './rule-set-routing.module';
import { RuleSetPage } from './rule-set.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RuleSetPageRoutingModule, SharedModule],
  declarations: [RuleSetPage],
})
export class RuleSetPageModule {}
