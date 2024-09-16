import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HelpCalculationFunctionsComponent } from "./help-calculation-functions.component";

describe("HelpCalculationFunctionsComponent", () => {
  let component: HelpCalculationFunctionsComponent;
  let fixture: ComponentFixture<HelpCalculationFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpCalculationFunctionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCalculationFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
