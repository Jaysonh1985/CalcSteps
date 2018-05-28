import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Calculation } from "../models/calculation";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  snapshotChanges
} from "angularfire2/database";
import { query } from "@angular/core/src/animation/dsl";
import { nodeChildrenAsMap } from "@angular/router/src/utils/tree";

@Injectable()
export class CalculationService {
  private dbPath = "calculations";
  calculationsRef: AngularFireList<Calculation> = null;
  results: string;
  constructor(private db: AngularFireDatabase) {
    this.calculationsRef = db.list(this.dbPath);
    this.results = "";
  }

  createCalculation(customer: Calculation): void {
    this.calculationsRef.push(customer);
  }

  updateCalculation(key: string, value: any): void {
    this.calculationsRef
      .update(key, value)
      .catch(error => this.handleError(error));
  }

  deleteCalculation(key: string): void {
    this.calculationsRef.remove(key).catch(error => this.handleError(error));
  }

  getCalculationsList(): AngularFireList<Calculation> {
    return this.calculationsRef;
  }

  getCalculation(key): AngularFireList<Calculation> {
    return this.db.list(this.dbPath, ref => ref.orderByKey().equalTo(key));
  }
  getCalculationListbyuid(uid): AngularFireList<Calculation> {
    return this.db.list(this.dbPath, ref =>
      ref.orderByChild("userid").equalTo(uid)
    );
  }
  deleteAll(): void {
    this.calculationsRef.remove().catch(error => this.handleError(error));
  }
  private handleError(error) {
    console.log(error);
  }
}
