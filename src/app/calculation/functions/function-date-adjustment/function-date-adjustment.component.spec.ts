import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionDateAdjustmentComponent } from './function-date-adjustment.component';

describe('FunctionDateAdjustmentComponent', () => {
  let component: FunctionDateAdjustmentComponent;
  let fixture: ComponentFixture<FunctionDateAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionDateAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionDateAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
