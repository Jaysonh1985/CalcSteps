import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FunctionDateDurationComponent } from "./function-date-duration.component";

describe("FunctionDateDurationComponent", () => {
  let component: FunctionDateDurationComponent;
  let fixture: ComponentFixture<FunctionDateDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionDateDurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionDateDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
