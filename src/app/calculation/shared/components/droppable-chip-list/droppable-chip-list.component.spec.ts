import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DroppableChipListComponent } from "./droppable-chip-list.component";

describe("DroppableChipListComponent", () => {
  let component: DroppableChipListComponent;
  let fixture: ComponentFixture<DroppableChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DroppableChipListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroppableChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
