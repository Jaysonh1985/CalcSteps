import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FunctionLookupTableComponent } from "./function-lookup-table.component";

describe("FunctionLookupTableComponent", () => {
  let component: FunctionLookupTableComponent;
  let fixture: ComponentFixture<FunctionLookupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FunctionLookupTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionLookupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
