import { NgModule } from '@angular/core';
import { RuleSetCardComponent } from './components/rule-set-card/rule-set-card.component';
import { MessagePipe } from './pipes/message.pipe';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [CommonModule, IonicModule],
    declarations: [
        RuleSetCardComponent, MessagePipe
    ],
    exports: [
        RuleSetCardComponent, MessagePipe
    ]
})
export class SharedModule {}
