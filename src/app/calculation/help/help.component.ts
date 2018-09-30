import { Component, OnInit } from "@angular/core";
import { MaterialModule } from "../../material.module";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.css"]
})
export class HelpComponent implements OnInit {
  screen: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.screen = "Index";
  }

  onChangeScreen(newScreen) {
    this.screen = newScreen;
  }

  onRouteDashboard() {
    this.router.navigate(["dashboard"]);
  }
}
