import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionMathsComponent } from './function-maths.component';

describe('FunctionMathsComponent', () => {
  let component: FunctionMathsComponent;
  let fixture: ComponentFixture<FunctionMathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionMathsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionMathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
