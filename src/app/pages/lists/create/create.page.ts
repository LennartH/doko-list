import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { RuleSet } from 'src/app/domain/rule-set';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {

  form: FormGroup;
  ruleSets: RuleSet[] = [];
  private ruleSetsSubscription: Subscription;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private ruleSetsService: RuleSetsService) { }

  // TODO Add button to create new (unnamed) rule set
  ngOnInit() {
    this.form = this.fb.group({
      players: this.fb.array(Array.from(Array(4).keys()).map(_ => ['', Validators.required])),
      ruleSet: ['', [Validators.required, this.ruleSetExists()]]
    });

    this.ruleSetsSubscription = this.ruleSetsService.ruleSets.subscribe(ruleSets => this.ruleSets = ruleSets);
    this.activatedRoute.queryParams.subscribe(params => {
      if ('selected' in params) {
        this.form.patchValue({ruleSet: params.selected});
      }
    });
  }

  ruleSetExists(): ValidatorFn {
    return control => {
      if (!this.ruleSets) {
        return null;
      }
      return this.ruleSets.some(r => r.name === control.value) ? null : {ruleSetDoesNotExist: {value: control.value}};
    };
  }

  get players(): FormArray {
    return this.form.get('players') as FormArray;
  }

  onSelectRuleSet(name: string) {
    this.form.patchValue({ruleSet: name});
  }

  onConfirm() {
    if (this.form.invalid) {
      return;
    }

    // TODO
    console.log(this.form.value);
  }

  ngOnDestroy() {
    this.ruleSetsSubscription.unsubscribe();
  }

}
