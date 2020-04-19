import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddRoundModalComponent } from 'src/app/components/add-round-modal/add-round-modal.component';
import { RoundDataFormComponent } from 'src/app/components/round-data-form/round-data-form.component';
import { DetailPageRoutingModule } from './detail-routing.module';
import { DetailPage } from './detail.page';
import { PartyAnnouncementComponent } from 'src/app/widgets/party-announcement/party-announcement.component';
import { ListDetailMenuComponent } from 'src/app/components/list-detail-menu/list-detail-menu.component';




@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    DetailPageRoutingModule
  ],
  declarations: [DetailPage, AddRoundModalComponent, RoundDataFormComponent, PartyAnnouncementComponent, ListDetailMenuComponent],
  entryComponents: [AddRoundModalComponent, ListDetailMenuComponent]
})
export class DetailPageModule {}
