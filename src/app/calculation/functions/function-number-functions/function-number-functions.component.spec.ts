import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FunctionNumberFunctionsComponent } from "./function-number-functions.component";

describe("FunctionNumberFunctionsComponent", () => {
  let component: FunctionNumberFunctionsComponent;
  let fixture: ComponentFixture<FunctionNumberFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionNumberFunctionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionNumberFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
