import { NgModule } from '@angular/core';
import { RuleSetCardComponent } from './components/rule-set-card/rule-set-card.component';
import { MessagePipe } from './pipes/message.pipe';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RuleSetForm } from './components/rule-set-form/rule-set-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GameListCardComponent } from './components/game-list-card/game-list-card.component';

@NgModule({
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    declarations: [
        RuleSetCardComponent, MessagePipe, RuleSetForm, GameListCardComponent
    ],
    exports: [
        RuleSetCardComponent, MessagePipe, RuleSetForm, GameListCardComponent
    ]
})
export class SharedModule {}
