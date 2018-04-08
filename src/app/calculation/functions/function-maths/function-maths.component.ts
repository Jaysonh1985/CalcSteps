import { Component, OnInit } from "@angular/core";
import * as mathJs from "mathjs";

export class Maths {
  public bracketOpen: string;
  public input1: string;
  function: string;
  input2: string;
  bracketClose: string;
  nextFunction: string;
}

@Component({
  selector: "app-function-maths",
  templateUrl: "./function-maths.component.html",
  styleUrls: ["./function-maths.component.css"]
})
export class FunctionMathsComponent implements OnInit {
  public maths: Maths;
  constructor() {
      this.maths = new Maths();
      this.maths.bracketClose = "(";
      this.maths.input1 = "1";
      this.maths.function = "+";
      this.maths.input2 = "5";
      this.maths.bracketClose = ")";
  }

  ngOnInit() {
    let a = mathJs.eval("5 ^ 250");
    console.log(a);
    a = null;
  }
}
