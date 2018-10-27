import "moment/locale/pt-br";

import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";

import { fallIn, moveIn, moveInLeft } from "../../router.animations";
import { AuthService } from "../../shared/services/auth.service";
import { CalculationConfigurationComponent } from "../calculation-configuration/calculation-configuration.component";
import { CalculationInputComponent } from "../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../calculation-output/calculation-output.component";
import { CalculationConfiguration } from "../shared/models/calculation-configuration";
import { CalculationError } from "../shared/models/calculation-error";
import { CalculationInput } from "../shared/models/calculation-input";
import { CalculationOutput } from "../shared/models/calculation-output";
import { AutoCompleteService } from "../shared/services/auto-complete.service";
import { CalculateService } from "../shared/services/calculate.service";
import { CalculationService } from "../shared/services/calculation.service";
import { LookupService } from "../shared/services/lookup.service";
import { ReleaseService } from "../shared/services/release.service";
import { CalculationComponent } from "../calculation.component";
import { PaymentsService } from "../../profile/payments/payments.service";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-release",
  templateUrl: "./release.component.html",
  styleUrls: ["./release.component.css"],
  animations: [moveIn(), fallIn(), moveInLeft()]
})
export class ReleaseComponent implements OnInit {
  isErrors: boolean;
  isInput: boolean;
  errors: string[];
  public calculation: any;
  public calculationConfiguration: CalculationConfiguration[];
  public calculationInput: CalculationInput[];
  public calculationOutput: CalculationOutput[];
  public calculationName: string;
  public calculationGroup: string;
  public calculationInputNodes: any[];
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  private CalculationConfigurationComponent: CalculationConfigurationComponent;
  public loading: boolean;
  public loadingProgress: number;
  displayName: string;
  constructor(
    private route: ActivatedRoute,
    private releaseService: ReleaseService,
    private router: Router,
    private calcService: CalculationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private autocompleteService: AutoCompleteService,
    private http: HttpClient,
    private lookupService: LookupService,
    private authService: AuthService,
    private calculateService: CalculateService,
    private paymentService: PaymentsService
  ) {
    this.errors = [];
  }

  ngOnInit() {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.displayName = auth.displayName;
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
            this.paymentService
              .getSubscriptions(this.calculation.userid)
              .snapshotChanges()
              .map(changes => {
                return changes.payload.val();
              })
              .subscribe(sub => {
                this.calculation = calculations[0];
                if (
                  sub.productId === "plan_Cwi9mPWRIyMUEp" &&
                  sub.status === "active"
                ) {
                  this.calcService
                    .getCalculation(this.calculation.calculationKey)
                    .snapshotChanges()
                    .map(changes => {
                      return changes.map(c => ({
                        key: c.payload.key,
                        ...c.payload.val()
                      }));
                    })
                    .subscribe(configurations => {
                      if (
                        this.onCheckUserId(auth.uid, configurations[0].users)
                      ) {
                        this.calculationInput =
                          calculations[0].calculationInputs;
                        this.calculationConfiguration =
                          calculations[0].calculationConfigurations;
                        this.calculationOutput =
                          calculations[0].calculationOutputs;
                        this.calculationName = calculations[0].name;
                        this.calculationGroup = calculations[0].group;
                        this.calculationInputNodes =
                          calculations[0].calculationInputs;
                      } else {
                        this.router.navigate(["release-error"]);
                      }
                    });
                } else if (
                  sub.productId === "plan_DhqyWHUScOFd9e" &&
                  sub.status === "active"
                ) {
                  this.calcService
                    .getCalculation(this.calculation.calculationKey)
                    .snapshotChanges()
                    .map(changes => {
                      return changes.map(c => ({
                        key: c.payload.key,
                        ...c.payload.val()
                      }));
                    })
                    .subscribe(configurations => {
                      this.calculationInput = calculations[0].calculationInputs;
                      this.calculationConfiguration =
                        calculations[0].calculationConfigurations;
                      this.calculationOutput =
                        calculations[0].calculationOutputs;
                      this.calculationName = calculations[0].name;
                      this.calculationGroup = calculations[0].group;
                      this.calculationInputNodes =
                        calculations[0].calculationInputs;
                    });
                } else {
                  this.router.navigate(["release-error"]);
                }
              });
          });
      }
    });
  }
  onReset() {
    this.CalculationInputComponent.onDeleteAllInputs();
    this.CalculationOutputComponent.onDeleteAllOutputs();
  }
  onExit() {
    this.router.navigate(["dashboard"]);
  }
  onCheckUserId(uid, array) {
    for (const element of array) {
      if (uid === element.uid) {
        return true;
      }
    }
    return false;
  }
  async onCalc() {
    this.loading = true;
    this.snackBar.open("Calculation in progress...", "Please wait", {
      duration: 500
    });
    this.loadingProgress = 0;
    const calculationComponent = new CalculationComponent(
      this.route,
      this.calcService,
      this.router,
      this.snackBar,
      this.dialog,
      this.autocompleteService,
      this.lookupService,
      this.authService,
      this.calculateService
    );
    const calculationInput = this.CalculationInputComponent.getAllRows();
    const getErrorsInput: CalculationInput[] = calculationComponent.getErrorsInput(
      calculationInput
    );
    const isErrorInput = calculationComponent.errorExists(getErrorsInput);
    this.CalculationInputComponent.setTableData(calculationInput);
    this.loadingProgress = 30;
    let autoCompleteInputs = [];
    autoCompleteInputs = this.CalculationInputComponent.getAllRows();
    const calculationConfiguration = this.CalculationConfigurationComponent.getAllRows();
    const getErrorsConfiguration: CalculationConfiguration[] = calculationComponent.getErrorsConfiguration(
      calculationConfiguration,
      autoCompleteInputs
    );
    const isErrorConfiguration = calculationComponent.errorExists(
      getErrorsConfiguration
    );
    this.loadingProgress = 50;
    if (isErrorInput === true || isErrorConfiguration === true) {
      this.snackBar.open("Calculation Failed", "Failed", {
        duration: 2000
      });
      this.loading = false;
      setTimeout(() => {
        this.loadingProgress = 0;
      }, 2000);
    }
    if (isErrorInput === false && isErrorConfiguration === false) {
      await calculationComponent.calculateConfiguration(
        calculationConfiguration,
        autoCompleteInputs
      );
      this.CalculationConfigurationComponent.setTableData(
        calculationConfiguration
      );
      this.loadingProgress = 70;
      let calculationOutput = this.CalculationOutputComponent.getAllRows();
      calculationOutput = calculationComponent.calculateOutput(
        calculationOutput,
        calculationConfiguration
      );
      this.CalculationOutputComponent.setTableData(calculationOutput);
      this.loadingProgress = 100;
      this.loading = false;
      this.snackBar.open("Calculated Successfully", "Success", {
        duration: 2000
      });
      this.isInput = false;
      setTimeout(() => {
        this.loadingProgress = 0;
      }, 2000);
    }
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
  getResultTransition() {
    if (!this.isInput) {
      return "void";
    } else {
      return "*";
    }
  }
}
