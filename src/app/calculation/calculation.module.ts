import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular/main";

import { CalculationConfigurationComponent } from "../calculation/calculation-configuration/calculation-configuration.component";
import { CalculationInputComponent } from "../calculation/calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../calculation/calculation-output/calculation-output.component";
import { CalculationComponent } from "../calculation/calculation.component";
import { FunctionDateAdjustmentComponent } from "../calculation/functions/function-date-adjustment/function-date-adjustment.component";
import { FunctionDateDurationComponent } from "../calculation/functions/function-date-duration/function-date-duration.component";
import { FunctionDistanceComponent } from "../calculation/functions/function-distance/function-distance.component";
import { FunctionIfLogicComponent } from "../calculation/functions/function-if-logic/function-if-logic.component";
import { FunctionLookupTableComponent } from "../calculation/functions/function-lookup-table/function-lookup-table.component";
import { FunctionMathsComponent } from "../calculation/functions/function-maths/function-maths.component";
import { LookupMaintenanceComponent } from "../calculation/lookup-maintenance/lookup-maintenance.component";
import { LookupDialogComponent } from "../calculation/lookup/lookup-dialog/lookup-dialog.component";
import { LookupComponent } from "../calculation/lookup/lookup.component";
import { ReleaseManagementComponent } from "../calculation/release-management/release-management.component";
import { ReleaseComponent } from "../calculation/release/release.component";
import { AutoCompleteService } from "../calculation/shared/services/auto-complete.service";
import { CalculateService } from "../calculation/shared/services/calculate.service";
import { CalculationService } from "../calculation/shared/services/calculation.service";
import { LookupService } from "../calculation/shared/services/lookup.service";
import { ReleaseService } from "../calculation/shared/services/release.service";
import { MaterialModule } from "../material.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    FlexLayoutModule
  ],
  declarations: [
    CalculationComponent,
    CalculationInputComponent,
    CalculationOutputComponent,
    FunctionMathsComponent,
    FunctionDateAdjustmentComponent,
    FunctionIfLogicComponent,
    FunctionDateDurationComponent,
    CalculationConfigurationComponent,
    ReleaseComponent,
    ReleaseManagementComponent,
    FunctionDistanceComponent,
    LookupComponent,
    LookupDialogComponent,
    LookupMaintenanceComponent,
    FunctionLookupTableComponent
  ],
  entryComponents: [LookupDialogComponent],
  providers: [
    CalculationService,
    ReleaseService,
    AutoCompleteService,
    LookupService,
    CalculateService
  ]
})
export class CalculationModule {}
