import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RuleSetForm } from 'src/app/components/rule-set-form/rule-set-form.component';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { RuleSetConfig } from 'src/app/domain/rule-set';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss']
})
export class CreatePage implements OnInit {
  ruleSetName: string;
  ruleSetConfig: RuleSetConfig;

  @ViewChild('f') form: RuleSetForm;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ruleSetsService: RuleSetsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if ('basedOn' in params) {
        this.ruleSetsService.ruleSet(params.basedOn).subscribe(ruleSet => {
          if (ruleSet === undefined) {
            return;
          }

          this.ruleSetName = ruleSet.name + ' - Kopie';
          this.ruleSetConfig = ruleSet.config;
        });
      }
    });
  }

  onConfirm() {
    if (this.form.invalid) {
      return;
    }
    this.ruleSetsService.addRuleSet(this.form.value);
    this.form.form.reset();
    this.router.navigateByUrl('/rule-set');
  }
}
