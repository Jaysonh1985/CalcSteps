import { Component, OnInit } from "@angular/core";
import * as mathJs from "mathjs";

@Component({
  selector: "app-function-maths",
  templateUrl: "./function-maths.component.html",
  styleUrls: ["./function-maths.component.css"]
})
export class FunctionMathsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    let a = mathJs.eval("5 ^ 250");
    console.log(a);
    a = null;
  }
}
