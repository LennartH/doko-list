import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnnouncementBehaviour, BockroundAfter, BonusScore } from 'src/app/domain/common';
import { defaultRuleSetConfig, RuleSet, RuleSetConfig } from 'src/app/domain/rule-set';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { $enum } from 'ts-enum-util';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss']
})
export class CreatePage implements OnInit {
  possibleBehaviours = $enum(AnnouncementBehaviour).getValues();
  possibleBonusScores = $enum(BonusScore).getValues();
  possibleBockroundsAfter = $enum(BockroundAfter).getValues();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ruleSetsService: RuleSetsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],  // TODO Validate that name is unique

      announcementBehaviour: [defaultRuleSetConfig.announcementBehaviour, Validators.required],
      losingAnnouncementsGivesScore: [defaultRuleSetConfig.losingAnnouncementsGivesScore, Validators.required],
      soloWinsOnTie: [defaultRuleSetConfig.soloWinsOnTie, Validators.required],
      losingPartyGetsNegatedScore: [defaultRuleSetConfig.losingPartyGetsNegatedScore, Validators.required],

      bonusScoreRules: this.fb.group(
        Object.fromEntries(
          $enum(BonusScore).map(value => {
            const isSelected = defaultRuleSetConfig.bonusScoreRules.some(v => v === value);
            return [value, isSelected];
          })
        )
      ),
      bonusScoresOnSolo: [defaultRuleSetConfig.bonusScoresOnSolo, Validators.required],

      bockroundAfter: this.fb.group(
        Object.fromEntries(
          $enum(BockroundAfter).map(value => {
            const isSelected = defaultRuleSetConfig.bockroundAfter.some(v => v === value);
            return [value, isSelected];
          })
        )
      ),
      consecutiveBockroundsStack: [defaultRuleSetConfig.consecutiveBockroundsStack, Validators.required]
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

  onConfirm() {
    if (this.form.invalid) {
      return;
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
    const ruleSet = new RuleSet(formData.name, config);
    this.ruleSetsService.addRuleSet(ruleSet);
    this.router.navigateByUrl('/rule-set');
  }
}
