import { NgModule } from "@angular/core";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule
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
    MatSelectModule,
    MatTabsModule
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
    MatSelectModule,
    MatTabsModule
  ]
})
export class MaterialModule {}
