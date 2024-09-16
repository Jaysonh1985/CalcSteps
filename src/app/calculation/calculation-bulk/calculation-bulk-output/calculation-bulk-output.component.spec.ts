import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalculationBulkOutputComponent } from "./calculation-bulk-output.component";

describe("CalculationBulkOutputComponent", () => {
  let component: CalculationBulkOutputComponent;
  let fixture: ComponentFixture<CalculationBulkOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationBulkOutputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationBulkOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
