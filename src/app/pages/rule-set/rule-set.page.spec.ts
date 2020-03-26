import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RuleSetPage } from './rule-set.page';

describe('RuleSetPage', () => {
  let component: RuleSetPage;
  let fixture: ComponentFixture<RuleSetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleSetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RuleSetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
