import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";
import "moment/locale/pt-br";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag
} from "@angular/cdk/drag-drop";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatChipInputEvent, MatDatepickerInputEvent } from "@angular/material";

@Component({
  selector: "app-droppable-chip-list",
  templateUrl: "./droppable-chip-list.component.html",
  styleUrls: ["./droppable-chip-list.component.css"],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class DroppableChipListComponent implements OnInit {
  @Input()
  chipArray: any[];
  @Input()
  name: string;
  @Input()
  datatype: string;
  @Input()  Identity: string;
  @Output() dropChip = new EventEmitter();
  @Output()
  removeChip = new EventEmitter();
  array: any[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor() {

  }

  ngOnInit() {
    this.Identity = this.name.replace(/\s/g, "");
    console.log(this.Identity);
  }
  drop(event: CdkDragDrop<string[]>) {
    this.array = [];
    this.array.push({
      name: event.item.data.name,
      type: event.item.data.type,
      datatype: event.item.data.datatype
    });
    this.dropChip.emit(this.array);
  }
  onDropChip(data: any) {
    // Get the dropped data here

  }

  onRemoveChip() {
    this.array = [];
    this.removeChip.emit(this.array);
  }

  addDateChip(type: string, event: MatDatepickerInputEvent<Date>) {
    moment.locale("en-GB");
    this.array = [];
    this.array.push({
      name: moment(event.value).format("DD/MM/YYYY"),
      type: "hardcoded",
      datatype: "Date"
    });
    this.dropChip.emit(this.array);
  }
  addNumberChip(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if (!isNaN(Number(value))) {
      // Add our fruit
      if ((value || "").trim()) {
        this.array = [];
        this.array.push({
          name: event.value,
          type: "hardcoded",
          datatype: "Number"
        });
        this.dropChip.emit(this.array);
      }
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  addTextChip(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      this.array = [];
      this.array.push({
        name: value.trim(),
        type: "hardcoded",
        datatype: "Text"
      });
      this.dropChip.emit(this.array);
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
}
