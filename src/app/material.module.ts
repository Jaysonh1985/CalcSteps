import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule
} from "@angular/material";

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ]
})
export class MaterialModule {}
