import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CalculationService } from "../shared/services/calculation.service";
import { CalculationInput } from "../shared/models/calculation-input";
import { CalculationTest } from "../shared/models/calculation-test";
import { AuthService } from "../../shared/services/auth.service";
import { MatDialog } from "@angular/material";
import { TestDialogComponent } from "./test-dialog/test-dialog.component";
import { Calculation } from "../shared/models/calculation";

@Component({
  selector: "app-test-management",
  templateUrl: "./test-management.component.html",
  styleUrls: ["./test-management.component.css"]
})
export class TestManagementComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calcService: CalculationService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}
  public calculationTest: CalculationTest;
  public calculationInput: CalculationInput[];
  public calculationTests: CalculationTest[];
  public calculation: any;
  public calculations: Calculation[];
  ngOnInit() {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        const key = this.route.snapshot.params["key"];
        this.calcService
          .getCalculation(key)
          .snapshotChanges()
          .pipe(
            map(changes => {
              return changes.map(c => ({
                key: c.payload.key,
                ...c.payload.val()
              }));
            })
          )
          .subscribe(calculations => {
            this.calculation = calculations[0];
            this.calculationInput = calculations[0].calculationInputs;
            this.calculationTests = calculations[0].calculationTests;
          });
      }
    });
  }

  routerCalculation(calculation) {
    this.router.navigate(["calculation", this.route.snapshot.params["key"]]);
  }

  onAddRow() {
    if (this.calculation.calculationTests === undefined) {
      this.calculation.calculationTests = [];
    }
    this.calculation.calculationTests.push({
      group: "Test",
      name: "",
      owner: "",
      pass: false,
      updateDate: new Date(),
      userid: "",
      username: "",
      calculationInputs: this.calculation.calculationInputs,
      calculationOutputs: this.calculation.calculationOutputs
    });

    this.calcService.updateCalculation(
      this.calculation.key,
      JSON.parse(JSON.stringify(this.calculation))
    );
  }

  onViewTest(item) {
    item.calculationInputs = this.mapInputs(item.calculationInputs);
    item.calculationOutputs = this.mapOutputs(item.calculationOutputs);
    const dialogRef = this.dialog.open(TestDialogComponent, {
      width: "800px",
      height: "80vh",
      data: {
        calculationInputs: item.calculationInputs,
        calculationOutputs: item.calculationOutputs,
        calculationConfiguration: this.calculation.calculationConfigurations,
        calculationTests: item
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.calculationInputs = result.calculationInputs;
        item.calculationOutputs = result.calculationOutputs;
        item.pass = this.isPass(result.calculationOutputs);
        this.calcService.updateCalculation(
          this.calculation.key,
          JSON.parse(JSON.stringify(this.calculation))
        );
      }
    });
  }
  mapInputs(oldCalculationInputs) {
    const newCalculationInputs = this.calculation.calculationInputs;
    for (const newInput of newCalculationInputs) {
      for (const oldInput of oldCalculationInputs) {
        if (oldInput.id === newInput.id) {
          newInput.output = oldInput.output;
          break;
        }
      }
    }
    return newCalculationInputs;
  }
  mapOutputs(oldCalculationOutput) {
    const newCalculationOutputs = this.calculation.calculationOutputs;
    for (const newOutput of newCalculationOutputs) {
      for (const oldOutput of oldCalculationOutput) {
        if (oldOutput.id === newOutput.id) {
          newOutput.output = oldOutput.output;
          newOutput.eresult = oldOutput.eresult;
          newOutput.pass = oldOutput.pass;
          break;
        }
      }
    }
    return newCalculationOutputs;
  }
  isPass(calculationOutputs) {
    for (const output of calculationOutputs) {
      if (output.pass === false) {
        return false;
      }
    }
    return true;
  }
}
