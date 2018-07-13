import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RouteModule } from "../app.router";
import { MaterialModule } from "../material.module";

@NgModule({
  imports: [CommonModule, RouteModule, MaterialModule],
  declarations: [SidenavComponent, ToolbarComponent],
  exports: [SidenavComponent, ToolbarComponent]
})
export class SharedModule {}
