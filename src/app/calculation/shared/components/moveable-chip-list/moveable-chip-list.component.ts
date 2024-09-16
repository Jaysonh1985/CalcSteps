import { Component, OnInit, Input } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag
} from "@angular/cdk/drag-drop";
@Component({
  selector: "app-moveable-chip-list",
  templateUrl: "./moveable-chip-list.component.html",
  styleUrls: ["./moveable-chip-list.component.css"]
})
export class MoveableChipListComponent implements OnInit {
  @Input()
  chipArray: any[];
  @Input()
  name: string;
  constructor() {}

  ngOnInit() {}

  drop(event: CdkDragDrop<string[]>) {
    return;
  }
  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item: CdkDrag<number>) {
    return false;
  }
}
