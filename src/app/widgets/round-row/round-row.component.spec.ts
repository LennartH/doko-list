import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoundRowComponent } from './round-row.component';

describe('RoundRowComponent', () => {
  let component: RoundRowComponent;
  let fixture: ComponentFixture<RoundRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundRowComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoundRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
