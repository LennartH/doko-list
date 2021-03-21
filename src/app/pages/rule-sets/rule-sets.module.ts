import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleSetsRoutingModule } from './rule-sets-routing.module';
import { RuleSetsComponent } from './rule-sets.component';

@NgModule({
  declarations: [RuleSetsComponent],
  imports: [CommonModule, RuleSetsRoutingModule],
})
export class RuleSetsModule {}
