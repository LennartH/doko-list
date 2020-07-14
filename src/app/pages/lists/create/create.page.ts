import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RuleSet } from 'src/app/domain/rule-set';
import { ListsService } from 'src/app/services/lists.service';
import { RuleSetsService } from 'src/app/services/rule-sets.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {
  form: FormGroup;
  ruleSets: RuleSet[] = [];
  private ruleSetsSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private ruleSetsService: RuleSetsService,
    private listsService: ListsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      players: this.fb.array(
        Array.from(Array(4).keys()).map((i) => ['', Validators.required]),
        this.arePlayerNamesUnique()
      ),
      ruleSet: ['', [Validators.required, this.ruleSetExists()]],
    });

    this.ruleSetsSubscription = this.ruleSetsService.ruleSets.subscribe((ruleSets) => (this.ruleSets = ruleSets));
    this.activatedRoute.queryParams.subscribe((params) => {
      const paramMap = convertToParamMap(params);
      if (paramMap.has('selected')) {
        this.form.patchValue({ ruleSet: paramMap.get('selected') });
      }
      if (paramMap.has('player')) {
        this.form.patchValue({ players: paramMap.getAll('player') });
      }
    });
  }

  arePlayerNamesUnique(): ValidatorFn {
    // FIXME Other inputs aren't updated
    return (control: FormArray) => {
      const duplicatedNames: number[] = [];
      for (let i = 0; i < control.length; i++) {
        const nameInput = control.at(i);
        if (!this.isPlayerNameUnique(i, control.value)) {
          duplicatedNames.push(i);
          nameInput.setErrors({ duplicated: true });
        } else {
          nameInput.setErrors(null);
        }
      }

      return duplicatedNames.length > 0 ? { duplicatedNames } : null;
    };
  }

  private isPlayerNameUnique(index: number, names: string[]): boolean {
    if (names[index].length === 0) {
      return true;
    }
    return !names.some((name, i) => i !== index && name === names[index]);
  }

  ruleSetExists(): ValidatorFn {
    return (control) => {
      if (!this.ruleSets) {
        return null;
      }
      return this.ruleSets.some((r) => r.name === control.value) ? null : { ruleSetDoesNotExist: { value: control.value } };
    };
  }

  get players(): FormArray {
    return this.form.get('players') as FormArray;
  }

  onSelectRuleSet(name: string) {
    this.form.patchValue({ ruleSet: name });
  }

  onCreateRuleSet() {
    let redirectPath = '/lists/create';
    const playerNames = this.form.value.players.filter((p: string) => p && p.length > 0);
    if (playerNames.length > 0) {
      redirectPath += '?' + playerNames.map((p: string) => `player=${p}`).join('&');
    }
    this.router.navigate(['/rule-set', 'create'], { queryParams: { redirect: redirectPath } });
  }

  onConfirm() {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.value;
    const ruleSet = this.ruleSets.find((r) => r.name === formData.ruleSet);
    const listId = this.listsService.addList(formData.players, ruleSet.name, ruleSet.config);

    this.form.reset();
    this.router.navigate(['/lists', 'detail', listId], { replaceUrl: true });
  }

  ngOnDestroy() {
    this.ruleSetsSubscription.unsubscribe();
  }
}
