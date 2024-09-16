import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FunctionTextFunctionsComponent } from "./function-text-functions.component";

describe("FunctionTextFunctionsComponent", () => {
  let component: FunctionTextFunctionsComponent;
  let fixture: ComponentFixture<FunctionTextFunctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionTextFunctionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionTextFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
