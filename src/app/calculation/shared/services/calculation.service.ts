import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Calculation } from "../models/calculation";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  snapshotChanges
} from "angularfire2/database";
import { nodeChildrenAsMap } from "@angular/router/src/utils/tree";
import { ReleaseService } from "./release.service";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class CalculationService {
  private dbPath = "calculations";
  calculationsRef: AngularFireList<Calculation> = null;
  results: string;
  readonly ROOT_URL =
    "https://us-central1-calc-steps.cloudfunctions.net/distanceMatrixProxy";
  constructor(
    private db: AngularFireDatabase,
    private releaseService: ReleaseService,
    private http: HttpClient
  ) {
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
    this.releaseService
      .getReleaseListbycalculationKey(key)
      .snapshotChanges()
      .pipe(
        map(newchanges => {
          return newchanges.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        })
      )
      .subscribe(releases => {
        releases.forEach(elementR => {
          this.releaseService.deleteRelease(elementR.key);
        });
      });
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

  getDistanceMatrix(origin: string, destination: string): Observable<any> {
    let params = new HttpParams();
    params = params.set("Origin", origin.toString());
    params = params.set("Destination", destination.toString());
    return this.http.get(this.ROOT_URL, { params });
  }
  private handleError(error) {
    console.log(error);
  }
}
