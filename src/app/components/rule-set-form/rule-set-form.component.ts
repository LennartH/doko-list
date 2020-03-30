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
  @Input() ruleSetName?: string;
  @Input() ruleSetConfig?: RuleSetConfig;

  private ruleSetNames: string[];
  private ruleSetsSubscription: Subscription;

  constructor(private fb: FormBuilder, private ruleSetsService: RuleSetsService) {}

  ngOnInit() {
    this.ruleSetsSubscription = this.ruleSetsService.ruleSets.subscribe(ruleSets => {
      this.ruleSetNames = ruleSets.map(r => r.name);
    });

    const initialName = this.ruleSetName || '';
    const initialConfig = this.ruleSetConfig || defaultRuleSetConfig;

    this.form = this.fb.group({
      name: [initialName, [Validators.required, this.nameMustBeUnique()]], // TODO Validate that name is unique

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

  nameMustBeUnique(): ValidatorFn {
    return control => {
      const duplicate = this.ruleSetNames.some(n => n === control.value);
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

  ngOnDestroy() {
    this.ruleSetsSubscription.unsubscribe();
  }
}
