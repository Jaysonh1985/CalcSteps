import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CalculationService } from "../shared/services/calculation.service";
import { CalculationInput } from "../shared/models/calculation-input";
import { CalculationTest } from "../shared/models/calculation-test";
import { CalculationOutput } from "../shared/models/calculation-output";
import { AuthService } from "../../shared/services/auth.service";
import { Calculation } from "../shared/models/calculation";
import { MatDialog } from "@angular/material";
import { TestDialogComponent } from "./test-dialog/test-dialog.component";

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
    public dialog: MatDialog,
  ) {}
  public calculationTest: CalculationTest;
  public calculationInput: CalculationInput[];
  public calculationTests: CalculationTest[];
  public calculation: any;
  ngOnInit() {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        const key = this.route.snapshot.params["key"];
        this.calcService
          .getCalculation(key)
          .snapshotChanges()
          .map(changes => {
            return changes.map(c => ({
              key: c.payload.key,
              ...c.payload.val()
            }));
          })
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
      userid : "",
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
    const dialogRef = this.dialog.open(TestDialogComponent, {
      width: "800px",
      height: "80vh",
      data: { calculationInputs: item.calculationInputs, calculationOutputs: item.calculationOutputs }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.calculationInputs = result.calculationInputs;
        item.calculationOutputs = result.calculationOutputs;
        this.calcService.updateCalculation(
          this.calculation.key,
          JSON.parse(JSON.stringify(this.calculation))
        );
      }
    });
  }
}
