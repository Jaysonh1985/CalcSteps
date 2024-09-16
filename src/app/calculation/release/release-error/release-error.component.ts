import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-release-error",
  templateUrl: "./release-error.component.html",
  styleUrls: ["./release-error.component.css"]
})
export class ReleaseErrorComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  routerHome() {
    this.router.navigate([""]);
  }

}
