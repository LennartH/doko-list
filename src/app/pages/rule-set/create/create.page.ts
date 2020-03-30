import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RuleSetForm } from 'src/app/components/rule-set-form/rule-set-form.component';
import { RuleSetsService } from 'src/app/services/rule-sets.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss']
})
export class CreatePage implements OnInit {
  @ViewChild('f') form: RuleSetForm;

  constructor(
    private ruleSetsService: RuleSetsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onConfirm() {
    if (this.form.invalid) {
      return;
    }
    this.ruleSetsService.addRuleSet(this.form.value);
    this.router.navigateByUrl('/rule-set');
  }
}
