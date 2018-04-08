import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FunctionIfLogicComponent } from "./function-if-logic.component";

describe("FunctionIfLogicComponent", () => {
  let component: FunctionIfLogicComponent;
  let fixture: ComponentFixture<FunctionIfLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionIfLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionIfLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
