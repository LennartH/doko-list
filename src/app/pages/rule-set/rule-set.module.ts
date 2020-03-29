import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RuleSetCardComponent } from 'src/app/components/rule-set-card/rule-set-card.component';
import { RuleSetPageRoutingModule } from './rule-set-routing.module';
import { RuleSetPage } from './rule-set.page';
import { SharedModule } from 'src/app/shared.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RuleSetPageRoutingModule,
    SharedModule
  ],
  declarations: [RuleSetPage]
})
export class RuleSetPageModule {}
