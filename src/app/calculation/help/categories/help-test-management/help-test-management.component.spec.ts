import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HelpTestManagementComponent } from "./help-test-management.component";

describe("HelpTestManagementComponent", () => {
  let component: HelpTestManagementComponent;
  let fixture: ComponentFixture<HelpTestManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpTestManagementComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
