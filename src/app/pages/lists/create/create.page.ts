import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { RuleSet } from 'src/app/domain/rule-set';
import { Subscription } from 'rxjs';
import { ListsService } from 'src/app/services/lists.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss']
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
      players: this.fb.array(Array.from(Array(4).keys()).map(_ => ['', Validators.required])),
      ruleSet: ['', [Validators.required, this.ruleSetExists()]]
    });

    this.ruleSetsSubscription = this.ruleSetsService.ruleSets.subscribe(ruleSets => (this.ruleSets = ruleSets));
    this.activatedRoute.queryParams.subscribe(params => {
      const paramMap = convertToParamMap(params);
      if (paramMap.has('selected')) {
        this.form.patchValue({ ruleSet: paramMap.get('selected') });
      }
      if (paramMap.has('player')) {
        this.form.patchValue({players: paramMap.getAll('player')});
      }
    });
  }

  ruleSetExists(): ValidatorFn {
    return control => {
      if (!this.ruleSets) {
        return null;
      }
      return this.ruleSets.some(r => r.name === control.value) ? null : { ruleSetDoesNotExist: { value: control.value } };
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
    this.router.navigate(['/rule-set', 'create'], {queryParams: {redirect: redirectPath}});
  }

  onConfirm() {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.value;
    const ruleSet = this.ruleSets.find(r => r.name === formData.ruleSet);
    const listId = this.listsService.addList(formData.players, ruleSet.name, ruleSet.config);

    this.form.reset();
    this.router.navigate(['/lists', 'detail', listId], { replaceUrl: true })
  }

  ngOnDestroy() {
    this.ruleSetsSubscription.unsubscribe();
  }
}
