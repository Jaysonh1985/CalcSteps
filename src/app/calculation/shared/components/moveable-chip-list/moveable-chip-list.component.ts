import { Component, OnInit, Input } from "@angular/core";
import { DragAndDropModule } from "angular-draggable-droppable";

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
}
