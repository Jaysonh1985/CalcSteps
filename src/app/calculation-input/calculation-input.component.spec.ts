import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalculationInputComponent } from "./calculation-input.component";

describe("AgGridInputComponent", () => {
  let component: CalculationInputComponent;
  let fixture: ComponentFixture<CalculationInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationInputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
