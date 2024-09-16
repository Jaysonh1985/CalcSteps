import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LookupMaintenanceComponent } from "./lookup-maintenance.component";

describe("LookupMaintenanceComponent", () => {
  let component: LookupMaintenanceComponent;
  let fixture: ComponentFixture<LookupMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LookupMaintenanceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
