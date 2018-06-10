import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Router, Routes } from "@angular/router";
import { Component } from "@angular/core";
import { AngularFireModule } from "angularfire2";
import { MaterialModule } from "./material.module";
import { AngularFireAuthModule } from "angularfire2/auth";
import { Subject } from "rxjs/Subject";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { routes } from "./app.router";
import { environment } from "../environments/environment";
import { AuthService } from "./services/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular/main";
import { CalculationComponent } from "./calculation/calculation.component";
import { CalculationInputComponent } from "./calculation/calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "./calculation/calculation-output/calculation-output.component";
import { FunctionMathsComponent } from "./calculation/functions/function-maths/function-maths.component";
import { FunctionDateAdjustmentComponent } from "./calculation/functions/function-date-adjustment/function-date-adjustment.component";
import { FunctionIfLogicComponent } from "./calculation/functions/function-if-logic/function-if-logic.component";
import { FunctionDateDurationComponent } from "./calculation/functions/function-date-duration/function-date-duration.component";
import { CalculationConfigurationComponent } from "./calculation/calculation-configuration/calculation-configuration.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import {
  AngularFireDatabaseModule,
  AngularFireList
} from "angularfire2/database";
import { CalculationService } from "./calculation/shared/services/calculation.service";
import { SignupComponent } from "./signup/signup.component";
import { AccountComponent } from "./account/account.component";
import { ReleaseComponent } from "./calculation/release/release.component";
import { ReleaseManagementComponent } from "./calculation/release-management/release-management.component";
import { ReleaseService } from "./calculation/shared/services/release.service";
import { InputDialogComponent } from "./shared/input-dialog/input-dialog.component";
import { ConfirmationDialogComponent } from "./shared/confirmation-dialog/confirmation-dialog.component";
import { AutoCompleteService } from "./calculation/shared/services/auto-complete.service";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { FunctionDistanceComponent } from "./calculation/functions/function-distance/function-distance.component";
import { SubscriptionPaymentComponent } from "./payments/subscription-payment/subscription-payment.component";
import { PaymentsService } from "./payments/payments.service";
import { LookupComponent } from "./calculation/lookup/lookup.component";
import { LookupDialogComponent } from "./calculation/lookup/lookup-dialog/lookup-dialog.component";
import { LookupMaintenanceComponent } from "./calculation/lookup-maintenance/lookup-maintenance.component";
import { LookupService } from "./calculation/shared/services/lookup.service";
import { FunctionLookupTableComponent } from "./calculation/functions/function-lookup-table/function-lookup-table.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CalculationComponent,
    CalculationInputComponent,
    CalculationOutputComponent,
    FunctionMathsComponent,
    FunctionDateAdjustmentComponent,
    FunctionIfLogicComponent,
    FunctionDateDurationComponent,
    CalculationConfigurationComponent,
    DashboardComponent,
    SignupComponent,
    AccountComponent,
    ReleaseComponent,
    ReleaseManagementComponent,
    InputDialogComponent,
    ConfirmationDialogComponent,
    FunctionDistanceComponent,
    SubscriptionPaymentComponent,
    LookupComponent,
    LookupDialogComponent,
    LookupMaintenanceComponent,
    FunctionLookupTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
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
    PaymentsService,
    LookupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
