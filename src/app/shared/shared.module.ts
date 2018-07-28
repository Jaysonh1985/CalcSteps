import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RouteModule } from "../app.router";
import { MaterialModule } from "../material.module";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { TokenInterceptor } from "./services/token.interceptor";
@NgModule({
  imports: [CommonModule, RouteModule, MaterialModule],
  declarations: [
    SidenavComponent,
    ToolbarComponent,
    LoadingSpinnerComponent
  ],
  exports: [
    SidenavComponent,
    ToolbarComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule {}
