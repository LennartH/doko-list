import { NgModule } from '@angular/core';
import { MessagePipe } from '../pipes/message.pipe';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { GameListCardComponent } from './components/game-list-card/game-list-card.component';
import { RoundResultPreviewComponent } from './components/round-result-preview/round-result-preview.component';
import { RuleSetCardComponent } from './components/rule-set-card/rule-set-card.component';
import { RuleSetForm } from './components/rule-set-form/rule-set-form.component';

@NgModule({
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    declarations: [
        RuleSetCardComponent, MessagePipe, RuleSetForm, GameListCardComponent, RoundResultPreviewComponent
    ],
    exports: [
        RuleSetCardComponent, MessagePipe, RuleSetForm, GameListCardComponent, RoundResultPreviewComponent
    ]
})
export class SharedModule {}
