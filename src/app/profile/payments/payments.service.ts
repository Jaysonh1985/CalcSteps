import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";

import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import * as firebase from "firebase/app";
import { Observable } from "rxjs";
import { Charge, StripeObject, Customer } from "./shared/models";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PaymentsService {
  userId: string;
  membership: any;
  membershipStatus: string;
  switchMap: [any];
  userFirebase: Observable<firebase.User>;
  readonly api = `${environment.functionsURL}/app`;
  private userDetails: firebase.User = null;
  private stripe = Stripe(environment.stripeKey);
  elements: any;
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.elements = this.stripe.elements();
    this.userFirebase = afAuth.authState;
    this.userFirebase.subscribe(user => {
      if (user) {
        this.userDetails = user;
      } else {
        this.userDetails = null;
      }
    });
  }
  getMembershipStatus(uid): AngularFireObject<any> {
    return this.db.object(`users/${uid}/enterprisemembership/status`);
  }
  // Get customer data
  getCustomer(): Observable<Customer> {
    const url = `${this.api}/customer/`;

    return this.http.get<Customer>(url);
  }
  // Get a list of charges
  getCharges(): Observable<Charge[]> {
    const url = `${this.api}/charges/`;

    return this.http.get<StripeObject>(url).map(res => res.data);
  }
  setStatus(status: string): void {
    this.db
      .object(`/users/${this.userDetails.uid}/enterprisemembership`)
      .update({ status: status });
  }
  processPayment(token: any) {
    return this.db
      .object(`/users/${this.userDetails.uid}/enterprisemembership`)
      .update({ token: token.id });
  }
}
