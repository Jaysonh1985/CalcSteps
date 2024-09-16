import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CalculationOutputComponent } from "./calculation-output.component";

describe("CalculationOutputComponent", () => {
  let component: CalculationOutputComponent;
  let fixture: ComponentFixture<CalculationOutputComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CalculationOutputComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
