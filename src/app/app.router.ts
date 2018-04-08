import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import { CalculationComponent } from "./calculation/calculation.component";


export const router: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "calculation", component: CalculationComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
