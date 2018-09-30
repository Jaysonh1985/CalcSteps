import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HelpCalculationConfigurationComponent } from "./help-calculation-configuration.component";

describe("HelpCalculationConfigurationComponent", () => {
  let component: HelpCalculationConfigurationComponent;
  let fixture: ComponentFixture<HelpCalculationConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpCalculationConfigurationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCalculationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
