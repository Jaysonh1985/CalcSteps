import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-lookup-dialog",
  templateUrl: "./lookup-dialog.component.html",
  styleUrls: ["./lookup-dialog.component.css"]
})
export class LookupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
