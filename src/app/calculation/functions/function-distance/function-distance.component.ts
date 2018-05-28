import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { CalculationService } from "../../shared/services/calculation.service";

export class Distance {
  origin: string;
  destination: string;
  constructor(origin, destination) {
    this.origin = "";
    this.destination = "";
  }
}

@Component({
  selector: "app-function-distance",
  templateUrl: "./function-distance.component.html",
  styleUrls: ["./function-distance.component.css"]
})
export class FunctionDistanceComponent implements OnInit {
  @Input() selectedRow: any[];
  @Input() autoCompleteArray: any[];
  public autoCompleteOptions: any[];
  filteredOptions: Observable<string[]>;
  public distance: Distance;
  constructor(private calcService: CalculationService) {}

  ngOnInit() {
    if (this.selectedRow[0].distance == null) {
      this.selectedRow[0].distance = this.distance;
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Text") {
        if (element.data.name !== "") {
          const autoCompleteText = element.data.name;
          this.autoCompleteOptions.push(autoCompleteText);
        }
      }
    });
  }
  filterAutoComplete(val: string) {
    if (val) {
      const filterValue = val.toLowerCase();
      return this.autoCompleteOptions.filter(state =>
        state.toLowerCase().startsWith(filterValue)
      );
    }
    return this.autoCompleteOptions;
  }
  public getAutoCompleteOutput(InputValue, array): string {
    let input = "";
    input = InputValue;
    array.forEach(value => {
      if (value.data.name === InputValue && value.data.data === "Text") {
        input = value.data.output;
      }
    });
    return input;
  }
}
