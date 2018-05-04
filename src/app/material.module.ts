import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatCardModule,
  MatDialogModule,
  MatSnackBarModule,
  MatInputModule,
  MatSelectModule
} from "@angular/material";

@NgModule({
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class MaterialModule {}
