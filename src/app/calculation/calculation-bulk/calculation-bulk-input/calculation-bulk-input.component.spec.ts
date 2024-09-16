import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalculationBulkInputComponent } from "./calculation-bulk-input.component";

describe("CalculationBulkInputComponent", () => {
  let component: CalculationBulkInputComponent;
  let fixture: ComponentFixture<CalculationBulkInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationBulkInputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationBulkInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
