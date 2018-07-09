import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AgGridModule } from "ag-grid-angular/main";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";

import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { routes } from "./app.router";
import { CalculationConfigurationComponent } from "./calculation/calculation-configuration/calculation-configuration.component";
import { CalculationInputComponent } from "./calculation/calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "./calculation/calculation-output/calculation-output.component";
import { CalculationComponent } from "./calculation/calculation.component";
import { FunctionDateAdjustmentComponent } from "./calculation/functions/function-date-adjustment/function-date-adjustment.component";
import { FunctionDateDurationComponent } from "./calculation/functions/function-date-duration/function-date-duration.component";
import { FunctionDistanceComponent } from "./calculation/functions/function-distance/function-distance.component";
import { FunctionIfLogicComponent } from "./calculation/functions/function-if-logic/function-if-logic.component";
import { FunctionLookupTableComponent } from "./calculation/functions/function-lookup-table/function-lookup-table.component";
import { FunctionMathsComponent } from "./calculation/functions/function-maths/function-maths.component";
import { LookupMaintenanceComponent } from "./calculation/lookup-maintenance/lookup-maintenance.component";
import { LookupDialogComponent } from "./calculation/lookup/lookup-dialog/lookup-dialog.component";
import { LookupComponent } from "./calculation/lookup/lookup.component";
import { ReleaseManagementComponent } from "./calculation/release-management/release-management.component";
import { ReleaseComponent } from "./calculation/release/release.component";
import { AutoCompleteService } from "./calculation/shared/services/auto-complete.service";
import { CalculateService } from "./calculation/shared/services/calculate.service";
import { CalculationService } from "./calculation/shared/services/calculation.service";
import { LookupService } from "./calculation/shared/services/lookup.service";
import { ReleaseService } from "./calculation/shared/services/release.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home/home.component";
import { MaterialModule } from "./material.module";
import { ProfileModule } from "./profile/profile.module";
import { ConfirmationDialogComponent } from "./shared/confirmation-dialog/confirmation-dialog.component";
import { InputDialogComponent } from "./shared/input-dialog/input-dialog.component";
import { AuthService } from "./shared/services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CalculationComponent,
    CalculationInputComponent,
    CalculationOutputComponent,
    FunctionMathsComponent,
    FunctionDateAdjustmentComponent,
    FunctionIfLogicComponent,
    FunctionDateDurationComponent,
    CalculationConfigurationComponent,
    DashboardComponent,
    ReleaseComponent,
    ReleaseManagementComponent,
    InputDialogComponent,
    ConfirmationDialogComponent,
    FunctionDistanceComponent,
    LookupComponent,
    LookupDialogComponent,
    LookupMaintenanceComponent,
    FunctionLookupTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    ProfileModule,
    routes,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    InputDialogComponent,
    ConfirmationDialogComponent,
    LookupDialogComponent
  ],
  providers: [
    AuthService,
    CalculationService,
    ReleaseService,
    AutoCompleteService,
    LookupService,
    CalculateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
