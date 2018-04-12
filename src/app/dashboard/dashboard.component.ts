import { Component, OnInit, Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public calculations$: AngularFireList<any[]>;
  items: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.items = db.collection("Configuration").valueChanges();
  }

  ngOnInit() {}
}
