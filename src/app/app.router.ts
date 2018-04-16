import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { CalculationComponent } from "./calculation/calculation.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "./services/auth-guard.service";

export const router: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "calculation/:key", component: CalculationComponent },
  { path: "dashboard", component: DashboardComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
