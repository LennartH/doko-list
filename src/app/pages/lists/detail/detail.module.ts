import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RuleSetCardComponent } from 'src/app/components/rule-set-card/rule-set-card.component';
import { SharedModule } from 'src/app/shared.module';
import { AddRoundModalComponent } from './components/add-round-modal/add-round-modal.component';
import { ListDetailMenuComponent } from './components/list-detail-menu/list-detail-menu.component';
import { RoundDataFormComponent } from './components/round-data-form/round-data-form.component';
import { RoundDetailsCardComponent } from './components/round-details-card/round-details-card.component';
import { PartyAnnouncementComponent } from './controls/party-announcement/party-announcement.component';
import { RoundRowComponent } from './controls/round-row/round-row.component';
import { DetailPageRoutingModule } from './detail-routing.module';
import { DetailPage } from './detail.page';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, DetailPageRoutingModule, SharedModule],
  declarations: [
    DetailPage,
    AddRoundModalComponent,
    RoundDataFormComponent,
    PartyAnnouncementComponent,
    ListDetailMenuComponent,
    RoundDetailsCardComponent,
    RoundRowComponent
  ],
  entryComponents: [AddRoundModalComponent, ListDetailMenuComponent, RoundDetailsCardComponent, RuleSetCardComponent],
})
export class DetailPageModule {}
