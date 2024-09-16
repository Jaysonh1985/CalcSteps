import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FunctionDistanceComponent } from "./function-distance.component";

describe("FunctionDistanceComponent", () => {
  let component: FunctionDistanceComponent;
  let fixture: ComponentFixture<FunctionDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionDistanceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
