import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LookupDialogComponent } from "./lookup-dialog.component";

describe("LookupDialogComponent", () => {
  let component: LookupDialogComponent;
  let fixture: ComponentFixture<LookupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LookupDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
