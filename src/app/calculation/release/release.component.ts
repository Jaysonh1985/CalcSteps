import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReleaseService } from "../shared/services/release.service";
import { CalculationConfiguration } from "../shared/models/calculation-configuration";
import { CalculationInput } from "../shared/models/calculation-input";
import { CalculationOutput } from "../shared/models/calculation-output";
import { CalculationInputComponent } from "../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../calculation-output/calculation-output.component";
import { CalculationConfigurationComponent } from "../calculation-configuration/calculation-configuration.component";
import { CalculationComponent } from "../calculation.component";
import { CalculationService } from "../shared/services/calculation.service";
import { CalculationError } from "../shared/models/calculation-error";

@Component({
  selector: "app-release",
  templateUrl: "./release.component.html",
  styleUrls: ["./release.component.css"]
})
export class ReleaseComponent implements OnInit {
  isErrors: boolean;
  isInput: boolean;
  public calculation: any;
  public calculationConfiguration: CalculationConfiguration;
  public calculationInput: CalculationInput[];
  public calculationOutput: CalculationOutput;
  public calculationName: string;
  public calculationGroup: string;
  public calculationInputNodes: any[];
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  private CalculationConfigurationComponent: CalculationConfigurationComponent;
  constructor(
    private route: ActivatedRoute,
    private releaseService: ReleaseService,
    private router: Router,
    private calcService: CalculationService
  ) {}

  ngOnInit() {
    const key = this.route.snapshot.params["key"];
    this.isInput = true;
    this.releaseService
      .getRelease(key)
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
        this.calculationConfiguration =
          calculations[0].calculationConfigurations;
        this.calculationOutput = calculations[0].calculationOutputs;
        this.calculationName = calculations[0].name;
        this.calculationGroup = calculations[0].group;
        this.calculationInputNodes = calculations[0].calculationInputs;
      });
  }
  onReset() {
    this.CalculationInputComponent.onDeleteAllInputs();
    this.CalculationOutputComponent.onDeleteAllOutputs();
  }
  onCalc() {
    this.isErrors = false;
    this.CalculationInputComponent.getAllRowsNodes().forEach(input => {
      input.data.errors = this.errorInput(input);
      this.CalculationInputComponent.setRowOuput(input.id, input.data);
    });
    let autoCompleteInputs = [];
    autoCompleteInputs = this.CalculationInputComponent.getAllRowsNodes();
    this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
      configuration => {
        const calc = new CalculationComponent(
          this.route,
          this.calcService,
          this.router
        );
        let autoCompleteConfig = [];
        let autoCompleteAll = [];
        autoCompleteConfig = this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
          configuration.rowIndex
        );
        autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
        if (configuration.data.functionType === "Maths") {
          configuration.data.errors = calc.errorMaths(
            configuration,
            autoCompleteAll
          );
        } else if (configuration.data.functionType === "Date Adjustment") {
          configuration.data.errors = calc.errorDateAdjustment(
            configuration,
            autoCompleteAll
          );
        } else if (configuration.data.functionType === "Date Duration") {
          configuration.data.errors = calc.errorDateDuration(
            configuration,
            autoCompleteAll
          );
        } else if (configuration.data.functionType === "If Logic") {
          configuration.data.errors = calc.errorIfLogic(
            configuration,
            autoCompleteAll
          );
        }
        this.CalculationConfigurationComponent.setRowOuput(
          configuration.id,
          configuration.data
        );
      }
    );

    if (this.isErrors === false) {
      this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
        configuration => {
          const calc = new CalculationComponent(
            this.route,
            this.calcService,
            this.router
          );
          let autoCompleteConfig = [];
          let autoCompleteAll = [];
          autoCompleteConfig = this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
            configuration.rowIndex
          );
          autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
          configuration.data.conditionResult = calc.calcCondition(
            configuration,
            autoCompleteAll
          );
          this.CalculationConfigurationComponent.setRowOuput(
            configuration.id,
            configuration.data
          );
          if (configuration.data.conditionResult === true) {
            if (configuration.data.functionType === "Maths") {
              configuration.data.output = calc.calcMaths(
                configuration,
                autoCompleteAll
              );
            } else if (configuration.data.functionType === "Date Adjustment") {
              configuration.data.output = calc.calcDateAdjustment(
                configuration,
                autoCompleteAll
              );
            } else if (configuration.data.functionType === "Date Duration") {
              configuration.data.output = calc.calcDateDuration(
                configuration,
                autoCompleteAll
              );
            } else if (configuration.data.functionType === "If Logic") {
              configuration.data.output = calc.calcIfLogic(
                configuration,
                autoCompleteAll
              );
            }
            this.CalculationConfigurationComponent.setRowOuput(
              configuration.id,
              configuration.data
            );
          }
        }
      );
      this.calcOutput();
    }
  }
  errorInput(input) {
    const inputs = new CalculationInputComponent();
    let errorCheck: CalculationError[];
    errorCheck = inputs.errorCheck(input);
    if (errorCheck.length > 0) {
      this.isErrors = true;
    }
    return errorCheck;
  }
  calcOutput() {
    this.CalculationOutputComponent.getAllRowsNodes().forEach(output => {
      this.CalculationOutputComponent.setRowOuput(output.id, "");
      let arr: Array<any> = [];
      arr = this.CalculationConfigurationComponent.getFinalRowNodes(
        output.data.variable
      );
      this.CalculationOutputComponent.setRowOuput(
        output.id,
        arr["data"].output
      );
    });
    this.isInput = false;
  }
  routeInput() {
    this.isInput = true;
  }
  getCalcStyle() {
    if (this.isInput) {
      return "";
    } else {
      return "None";
    }
  }
  getResultStyle() {
    if (!this.isInput) {
      return "";
    } else {
      return "None";
    }
  }
}
