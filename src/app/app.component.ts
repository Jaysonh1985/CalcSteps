import { Component } from "@angular/core";

interface Configuration {
  function: boolean;
  group: string;
  name: string;
  owner: string;
  pass: boolean;
  type: string;
  username: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor() {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {}
}
