import { NgModule } from '@angular/core';
import { RuleSetCardComponent } from './components/rule-set-card/rule-set-card.component';
import { MessagePipe } from './pipes/message.pipe';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RuleSetForm } from './components/rule-set-form/rule-set-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    declarations: [
        RuleSetCardComponent, MessagePipe, RuleSetForm
    ],
    exports: [
        RuleSetCardComponent, MessagePipe, RuleSetForm
    ]
})
export class SharedModule {}
