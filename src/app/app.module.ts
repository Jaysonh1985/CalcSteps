import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Router, Routes } from "@angular/router";
import { Component } from "@angular/core";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule} from "angularfire2/auth";
import { Subject } from "rxjs/Subject";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { routes } from "./app.router";
import { environment } from "../environments/environment";
import { AuthService } from "./services/auth.service";
import { FormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular/main";
import { CalculationComponent } from "./calculation/calculation.component";
import { CalculationInputComponent } from "./calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "./calculation-output/calculation-output.component";
import { FunctionMathsComponent } from "./function-maths/function-maths.component";
import { FunctionDateAdjustmentComponent } from "./function-date-adjustment/function-date-adjustment.component";
import { FunctionIfLogicComponent } from "./function-if-logic/function-if-logic.component";
import { FunctionDateDurationComponent } from "./function-date-duration/function-date-duration.component";
import { CalculationConfigurationComponent } from "./calculation-configuration/calculation-configuration.component";

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
    CalculationConfigurationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    routes,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    AgGridModule.withComponents([])
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
