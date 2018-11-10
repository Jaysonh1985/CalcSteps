import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";

import { CalculationConfigurationComponent } from "./calculation-configuration/calculation-configuration.component";
import { CalculationInputComponent } from "./calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "./calculation-output/calculation-output.component";
import { CalculationComponent } from "./calculation.component";
import { FunctionDateAdjustmentComponent } from "./functions/function-date-adjustment/function-date-adjustment.component";
import { FunctionDateDurationComponent } from "./functions/function-date-duration/function-date-duration.component";
import { FunctionDistanceComponent } from "./functions/function-distance/function-distance.component";
import { FunctionIfLogicComponent } from "./functions/function-if-logic/function-if-logic.component";
import { FunctionLookupTableComponent } from "./functions/function-lookup-table/function-lookup-table.component";
import { FunctionMathsComponent } from "./functions/function-maths/function-maths.component";
import { LookupMaintenanceComponent } from "./lookup-maintenance/lookup-maintenance.component";
import { LookupDialogComponent } from "./lookup/lookup-dialog/lookup-dialog.component";
import { LookupComponent } from "./lookup/lookup.component";
import { ReleaseManagementComponent } from "./release-management/release-management.component";
import { ReleaseComponent } from "./release/release.component";
import { AutoCompleteService } from "./shared/services/auto-complete.service";
import { CalculateService } from "./shared/services/calculate.service";
import { CalculationService } from "./shared/services/calculation.service";
import { LookupService } from "./shared/services/lookup.service";
import { ReleaseService } from "./shared/services/release.service";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { UserManagementComponent } from "./user-management/user-management.component";
import { DragAndDropModule } from "angular-draggable-droppable";
import { DragulaModule } from "ng2-dragula";
import { NgDragDropModule } from "ng-drag-drop";
import { TestManagementComponent } from "./test-management/test-management.component";
import { TestDialogComponent } from "./test-management/test-dialog/test-dialog.component";
import { HelpComponent } from "./help/help.component";
import { HelpReleaseManagementComponent } from "./help/categories/help-release-management/help-release-management.component";
// tslint:disable-next-line:max-line-length
import { HelpCalculationConfigurationComponent } from "./help/categories/help-calculation-configuration/help-calculation-configuration.component";
import { HelpTestManagementComponent } from "./help/categories/help-test-management/help-test-management.component";
import { HelpCalculationFunctionsComponent } from "./help/categories/help-calculation-functions/help-calculation-functions.component";
import { HelpLookupMaintenanceComponent } from "./help/categories/help-lookup-maintenance/help-lookup-maintenance.component";
import { HelpUserMaintenanceComponent } from "./help/categories/help-user-maintenance/help-user-maintenance.component";
import { ReleaseErrorComponent } from "./release/release-error/release-error.component";
import { FunctionNumberFunctionsComponent } from "./functions/function-number-functions/function-number-functions.component";
import { FunctionTextFunctionsComponent } from "./functions/function-text-functions/function-text-functions.component";
import { MoveableChipListComponent } from "./shared/components/moveable-chip-list/moveable-chip-list.component";
import { DroppableChipListComponent } from './shared/components/droppable-chip-list/droppable-chip-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    FlexLayoutModule,
    SharedModule,
    DragAndDropModule,
    DragulaModule.forRoot(),
    NgDragDropModule.forRoot()
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
    FunctionLookupTableComponent,
    UserManagementComponent,
    TestManagementComponent,
    TestDialogComponent,
    HelpComponent,
    HelpReleaseManagementComponent,
    HelpCalculationConfigurationComponent,
    HelpTestManagementComponent,
    HelpCalculationFunctionsComponent,
    HelpLookupMaintenanceComponent,
    HelpUserMaintenanceComponent,
    ReleaseErrorComponent,
    FunctionNumberFunctionsComponent,
    FunctionTextFunctionsComponent,
    MoveableChipListComponent,
    DroppableChipListComponent
  ],
  entryComponents: [LookupDialogComponent, TestDialogComponent],
  providers: [
    CalculationService,
    ReleaseService,
    AutoCompleteService,
    LookupService,
    CalculateService
  ]
})
export class CalculationModule {}
