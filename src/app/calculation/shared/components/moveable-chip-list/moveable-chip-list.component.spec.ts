import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MoveableChipListComponent } from "./moveable-chip-list.component";

describe("MoveableChipListComponent", () => {
  let component: MoveableChipListComponent;
  let fixture: ComponentFixture<MoveableChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoveableChipListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveableChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
