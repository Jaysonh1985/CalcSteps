import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule,  } from "angularfire2";
import { Component } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { Time } from "@angular/common";

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

  config$: Observable<Configuration[]>;
  configRef: AngularFirestoreCollection<Configuration>;

  constructor(
    private afs: AngularFirestore
  ) { }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.configRef = this.afs.collection<Configuration>("Configuration");
    this.config$ = this.configRef.valueChanges();
  }
}
