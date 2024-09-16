import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent implements OnInit {
  constructor() {}
  @Input() toolBar: any[];
  @Input() title: any[];
  ngOnInit() {}
}
