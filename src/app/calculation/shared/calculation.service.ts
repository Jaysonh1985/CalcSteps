import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Calculation } from "./calculation";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

@Injectable()
export class CalculationService {
  private dbPath = "calculations";

  calculationsRef: AngularFireList<Calculation> = null;

  constructor(private db: AngularFireDatabase) {
    this.calculationsRef = db.list(this.dbPath);
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

  deleteAll(): void {
    this.calculationsRef.remove().catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }
}
