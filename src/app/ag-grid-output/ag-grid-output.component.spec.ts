import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AgGridOutputComponent } from "./ag-grid-output.component";

describe("AgGridOutputComponent", () => {
  let component: AgGridOutputComponent;
  let fixture: ComponentFixture<AgGridOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
