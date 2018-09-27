import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-test-dialog",
  templateUrl: "./test-dialog.component.html",
  styleUrls: ["./test-dialog.component.css"]
})
export class TestDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {

  }
}
