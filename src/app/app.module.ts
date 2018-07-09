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
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home/home.component";
import { MaterialModule } from "./material.module";
import { ProfileModule } from "./profile/profile.module";
import { ConfirmationDialogComponent } from "./shared/confirmation-dialog/confirmation-dialog.component";
import { InputDialogComponent } from "./shared/input-dialog/input-dialog.component";
import { AuthService } from "./shared/services/auth.service";
import { CalculationModule } from "./calculation/calculation.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    InputDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    ProfileModule,
    CalculationModule,
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
    ConfirmationDialogComponent
  ],
  providers: [
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
