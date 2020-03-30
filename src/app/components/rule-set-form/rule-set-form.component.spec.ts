import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RuleSetForm } from './rule-set-form.component';

describe('RuleSetFormComponent', () => {
  let component: RuleSetForm;
  let fixture: ComponentFixture<RuleSetForm>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleSetForm ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RuleSetForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
