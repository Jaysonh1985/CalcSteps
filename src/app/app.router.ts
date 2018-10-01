import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CalculationComponent } from "./calculation/calculation.component";
import { LookupMaintenanceComponent } from "./calculation/lookup-maintenance/lookup-maintenance.component";
import { LookupComponent } from "./calculation/lookup/lookup.component";
import { ReleaseManagementComponent } from "./calculation/release-management/release-management.component";
import { ReleaseComponent } from "./calculation/release/release.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home/home.component";
import { AccountComponent } from "./profile/account/account.component";
import { LoginComponent } from "./profile/login/login.component";
import { SignupComponent } from "./profile/signup/signup.component";
import { UserManagementComponent } from "./calculation/user-management/user-management.component";
import { TestManagementComponent } from "./calculation/test-management/test-management.component";
import { HelpComponent } from "./calculation/help/help.component";
import { ReleaseErrorComponent } from "./calculation/release/release-error/release-error.component";

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
  { path: "lookup/:key", component: LookupComponent },
  { path: "user-management/:key", component: UserManagementComponent },
  { path: "test-management/:key", component: TestManagementComponent },
  { path: "help", component: HelpComponent },
  { path: "release-error", component: ReleaseErrorComponent },
];

export const RouteModule: ModuleWithProviders = RouterModule.forRoot(router);
