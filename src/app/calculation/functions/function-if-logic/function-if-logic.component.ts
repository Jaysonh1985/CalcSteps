import { Component, OnInit, Input } from "@angular/core";
export class IfLogic {
  bracketOpen: string;
  input1: string;
  functionType: string;
  input2: string;
  bracketClose: string;
  nextFunction: string;
}
@Component({
  selector: "app-function-if-logic",
  templateUrl: "./function-if-logic.component.html",
  styleUrls: ["./function-if-logic.component.css"]
})
export class FunctionIfLogicComponent implements OnInit {
  @Input() selectedRow: any[];
  @Input() autoCompleteArray: any[];
  public ifLogic: IfLogic;
  public autoCompleteOptions: any[];
  constructor() {
    this.ifLogic = new IfLogic();
    this.ifLogic.bracketOpen = "";
    this.ifLogic.input1 = "";
    this.ifLogic.functionType = "";
    this.ifLogic.input2 = "";
    this.ifLogic.bracketClose = "";
    this.ifLogic.nextFunction = "";
  }
  onAddRow() {
    this.ifLogic = new IfLogic();
    this.ifLogic.bracketOpen = "";
    this.ifLogic.input1 = "";
    this.ifLogic.functionType = "";
    this.ifLogic.input2 = "";
    this.ifLogic.bracketClose = "";
    this.ifLogic.nextFunction = "";
    this.selectedRow[0].ifLogic.push(this.ifLogic);
  }
  onDeleteRow(index) {
    this.selectedRow[0].maths.splice(index, 1);
  }
  ngOnInit() {
    if (this.selectedRow[0].ifLogic == null) {
      this.selectedRow[0].ifLogic = [this.ifLogic];
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.name !== "") {
        const autoCompleteText = element.data.name;
          this.autoCompleteOptions.push(autoCompleteText);
      }
    });
  }
}
