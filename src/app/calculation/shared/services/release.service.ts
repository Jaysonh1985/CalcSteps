import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Release } from "../models/release";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  snapshotChanges
} from "angularfire2/database";
import { query } from "@angular/core/src/animation/dsl";
import { nodeChildrenAsMap } from "@angular/router/src/utils/tree";

@Injectable()
export class ReleaseService {
  private dbPath = "releases";
  releaseRef: AngularFireList<Release> = null;
  constructor(private db: AngularFireDatabase) {
    this.releaseRef = db.list(this.dbPath);
  }
  createRelease(customer: Release): void {
    this.releaseRef.push(customer);
  }
  updateRelease(key: string, value: any): void {
    this.releaseRef.update(key, value).catch(error => this.handleError(error));
  }
  deleteRelease(key: string): void {
    this.releaseRef.remove(key).catch(error => this.handleError(error));
  }
  getReleaseList(): AngularFireList<Release> {
    return this.releaseRef;
  }
  getReleaseListbycalculationKey(key): AngularFireList<Release> {
    return this.db.list(this.dbPath, ref => ref.orderByChild("calculationKey").equalTo(key));
  }
  getRelease(key): AngularFireList<Release> {
    return this.db.list(this.dbPath, ref => ref.orderByKey().equalTo(key));
  }
  deleteAll(): void {
    this.releaseRef.remove().catch(error => this.handleError(error));
  }
  private handleError(error) {
    console.log(error);
  }
}
