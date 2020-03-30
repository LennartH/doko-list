import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BockroundAfter, BonusScore, AnnouncementBehaviour } from 'src/app/domain/common';
import { defaultRuleSetConfig, RuleSet, RuleSetConfig } from 'src/app/domain/rule-set';
import { $enum } from 'ts-enum-util';

@Component({
  selector: 'app-rule-set-form',
  templateUrl: './rule-set-form.component.html',
  styleUrls: ['./rule-set-form.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class RuleSetForm implements OnInit {
  possibleBehaviours = $enum(AnnouncementBehaviour).getValues();
  possibleBonusScores = $enum(BonusScore).getValues();
  possibleBockroundsAfter = $enum(BockroundAfter).getValues();

  form: FormGroup;
  @Input() ruleSetName?: string;
  @Input() ruleSetConfig?: RuleSetConfig;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const initialName = this.ruleSetName || '';
    const initialConfig = this.ruleSetConfig || defaultRuleSetConfig;

    this.form = this.fb.group({
      name: [initialName, Validators.required], // TODO Validate that name is unique

      announcementBehaviour: [initialConfig.announcementBehaviour, Validators.required],
      losingAnnouncementsGivesScore: [initialConfig.losingAnnouncementsGivesScore, Validators.required],
      soloWinsOnTie: [initialConfig.soloWinsOnTie, Validators.required],
      losingPartyGetsNegatedScore: [initialConfig.losingPartyGetsNegatedScore, Validators.required],

      bonusScoreRules: this.fb.group(
        Object.fromEntries(
          $enum(BonusScore).map(value => {
            const isSelected = initialConfig.bonusScoreRules.some(v => v === value);
            return [value, isSelected];
          })
        )
      ),
      bonusScoresOnSolo: [initialConfig.bonusScoresOnSolo, Validators.required],

      bockroundAfter: this.fb.group(
        Object.fromEntries(
          $enum(BockroundAfter).map(value => {
            const isSelected = initialConfig.bockroundAfter.some(v => v === value);
            return [value, isSelected];
          })
        )
      ),
      consecutiveBockroundsStack: [initialConfig.consecutiveBockroundsStack, Validators.required]
    });
  }

  toggleBonusScore(value: string) {
    this.form.patchValue({
      bonusScoreRules: { [value]: !this.form.value.bonusScoreRules[value] }
    });
  }

  toggleBockroundAfter(value: string) {
    this.form.patchValue({
      bockroundAfter: { [value]: !this.form.value.bockroundAfter[value] }
    });
  }

  get valid(): boolean {
    return this.form?.valid;
  }

  get invalid(): boolean {
    return this.form?.invalid;
  }

  get value(): RuleSet | undefined {
    if (this.invalid) {
      return undefined;
    }

    const formData = this.form.value;
    const config: RuleSetConfig = {
      announcementBehaviour: formData.announcementBehaviour,
      losingAnnouncementsGivesScore: formData.losingAnnouncementsGivesScore,
      soloWinsOnTie: formData.soloWinsOnTie,
      losingPartyGetsNegatedScore: formData.losingPartyGetsNegatedScore,

      bonusScoreRules: [...$enum(BonusScore).values()].filter(value => formData.bonusScoreRules[value]),
      bonusScoresOnSolo: formData.bonusScoresOnSolo,

      bockroundAfter: [...$enum(BockroundAfter).values()].filter(value => formData.bockroundAfter[value]),
      consecutiveBockroundsStack: formData.consecutiveBockroundsStack
    };
    return new RuleSet(formData.name, config);
  }
}
