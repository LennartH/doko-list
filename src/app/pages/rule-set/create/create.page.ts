import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router, UrlTree } from '@angular/router';
import { RuleSetConfig } from 'src/app/domain/rule-set';
import { RuleSetsService } from 'src/app/services/rule-sets.service';
import { RuleSetForm } from 'src/app/shared/components/rule-set-form/rule-set-form.component';

// TODO Separate name field and config form
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss']
})
export class CreatePage implements OnInit {
  ruleSetName: string;
  ruleSetConfig: RuleSetConfig;

  @ViewChild('f') form: RuleSetForm;

  private redirectPath: string;

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
      if ('redirect' in params) {
        this.redirectPath = params.redirect;
      }
    });
  }

  onAbort() {
    this.router.navigateByUrl(this.getTargetUrl(), { replaceUrl: true });
  }

  onConfirm() {
    if (this.form.invalid) {
      return;
    }
    const formData = this.form.value;
    this.ruleSetsService.addRuleSet(formData.name, formData.config);
    this.form.form.reset();
    this.router.navigateByUrl(this.getTargetUrl());
  }

  getTargetUrl(): string | UrlTree {
    let targetUrl: string | UrlTree = '/rule-set';
    if (this.redirectPath) {
      targetUrl = this.router.parseUrl(this.redirectPath);
      const segments = targetUrl.root.children[PRIMARY_OUTLET].segments;
      if (this.form.valid && segments.length >= 2 && segments[0].path === 'lists' && segments[1].path === 'create') {
        targetUrl.queryParams.selected = this.form.value.name;
      }
    }
    return targetUrl;
  }
}
