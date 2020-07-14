import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { BockroundAfter, BonusScore, AnnouncementBehaviour } from 'src/app/domain/common';
import { defaultRuleSetConfig, RuleSet, RuleSetConfig } from 'src/app/domain/rule-set';
import { $enum } from 'ts-enum-util';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rule-set-form',
  templateUrl: './rule-set-form.component.html',
  styleUrls: ['./rule-set-form.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class RuleSetForm implements OnInit, OnDestroy {
  possibleBehaviours = $enum(AnnouncementBehaviour).getValues();
  possibleBonusScores = $enum(BonusScore).getValues();
  possibleBockroundsAfter = $enum(BockroundAfter).getValues();

  form: FormGroup;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() ruleSetName?: string;
  @Input() ruleSetConfig?: RuleSetConfig;

  private initialName: string;
  private ruleSetNames: string[];
  private ruleSetsSubscription: Subscription;

  constructor(private fb: FormBuilder, private ruleSetsService: RuleSetsService) {}

  ngOnInit() {
    if (this.mode === 'edit' && (!this.ruleSetName || !this.ruleSetConfig)) {
      throw new Error('Edit mode requires rule set name and config');
    }

    this.ruleSetsSubscription = this.ruleSetsService.ruleSets.subscribe(ruleSets => {
      this.ruleSetNames = ruleSets.map(r => r.name);
    });

    this.initialName = this.ruleSetName || '';
    const initialConfig = this.ruleSetConfig || defaultRuleSetConfig;

    this.form = this.fb.group({
      name: [this.initialName, [Validators.required, this.nameIsUnique()]],

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

  nameIsUnique(): ValidatorFn {
    return control => {
      let duplicate = this.ruleSetNames.some(n => n === control.value);
      if (this.mode === 'edit' && control.value === this.initialName) {
        duplicate = false;
      }
      if (duplicate) {
        return { duplicateName: { value: control.value } };
      }
      return null;
    };
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

  get name(): AbstractControl {
    return this.form.get('name');
  }

  get valid(): boolean {
    return this.form?.valid;
  }

  get invalid(): boolean {
    return this.form?.invalid;
  }

  get value(): {initialName?: string, name: string, config: RuleSetConfig} | undefined {
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

    return {
      initialName: this.initialName,
      name: this.form.value.name,
      config
    };
  }

  ngOnDestroy() {
    this.ruleSetsSubscription.unsubscribe();
  }
}
