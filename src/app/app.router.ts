import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { CalculationComponent } from "./calculation/calculation.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { SignupComponent } from "./signup/signup.component";
import { AccountComponent } from "./account/account.component";
import { ReleaseManagementComponent } from "./calculation/release-management/release-management.component";
import { ReleaseComponent } from "./calculation/release/release.component";
import { LookupComponent } from "./calculation/lookup/lookup.component";
import { LookupMaintenanceComponent } from "./calculation/lookup-maintenance/lookup-maintenance.component";

export const router: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "calculation/:key", component: CalculationComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "signup", component: SignupComponent },
  { path: "account", component: AccountComponent },
  { path: "release-management/:key", component: ReleaseManagementComponent },
  { path: "release/:key", component: ReleaseComponent },
  { path: "lookup-maintenance", component: LookupMaintenanceComponent },
  { path: "lookup/:key", component: LookupComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
