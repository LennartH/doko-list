import { Component, OnInit, ViewChild } from '@angular/core';
import { RuleSetConfig, RuleSet } from 'src/app/domain/rule-set';
import { ActivatedRoute, Router } from '@angular/router';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { RuleSetForm } from 'src/app/shared/components/rule-set-form/rule-set-form.component';

// TODO Separate name field and config form
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  ruleSetName: string;
  ruleSetConfig: RuleSetConfig;

  @ViewChild('f') form: RuleSetForm;

  constructor(private activatedRoute: ActivatedRoute, private ruleSetsService: RuleSetsService, private router: Router) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if ('ruleSetName' in params) {
        this.ruleSetsService.ruleSet(params.ruleSetName).subscribe((ruleSet) => {
          if (ruleSet === undefined) {
            this.router.navigateByUrl('/rule-set');
            return;
          }

          this.ruleSetName = ruleSet.name;
          this.ruleSetConfig = ruleSet.config;
        });
      }
    });
  }

  onConfirm() {
    if (this.form.invalid) {
      return;
    }
    const formData = this.form.value;
    this.ruleSetsService.editRuleSet(formData.initialName, formData.name, formData.config);
    this.form.form.reset();
    this.router.navigateByUrl('/rule-set');
  }
}
