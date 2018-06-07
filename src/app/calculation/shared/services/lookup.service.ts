import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  snapshotChanges
} from "angularfire2/database";
import { Lookup } from "../models/lookup";
@Injectable()
export class LookupService {
  private dbPath = "lookups";
  lookupsRef: AngularFireList<Lookup> = null;
  results: string;
  constructor(private db: AngularFireDatabase) {
    this.lookupsRef = db.list(this.dbPath);
    this.results = "";
  }
  createLookup(lookup: any): void {
    this.lookupsRef.push(lookup);
  }
  updateLookup(key: string, value: any): void {
    this.lookupsRef.update(key, value).catch(error => console.log(error));
  }
  getLookup(key): AngularFireList<Lookup> {
    return this.db.list(this.dbPath, ref => ref.orderByKey().equalTo(key));
  }
  getLookupListbyuid(uid): AngularFireList<Lookup> {
    return this.db.list(this.dbPath, ref =>
      ref.orderByChild("userid").equalTo(uid)
    );
  }
}
