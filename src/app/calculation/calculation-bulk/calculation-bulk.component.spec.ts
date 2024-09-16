import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalculationBulkComponent } from "./calculation-bulk.component";

describe("CalculationBulkComponent", () => {
  let component: CalculationBulkComponent;
  let fixture: ComponentFixture<CalculationBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationBulkComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
