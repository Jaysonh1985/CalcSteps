import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { switchMap } from "rxjs/operators";
import { fromPromise } from "rxjs/observable/fromPromise";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import * as firebase from "firebase/app";
import { Observable } from "rxjs";
import {
  Customer,
  Source,
  Charge,
  SubscriptionPlan,
  StripeObject
} from "./shared/models";
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
  getSubscriptions(uid): AngularFireObject<any> {
    return this.db.object(`users/${uid}/subscriptions`);
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
  createCharge(card: any, amount: number): Observable<Charge> {
    const url = `${this.api}/charges/`;

    return fromPromise<Source>(this.stripe.createSource(card)).pipe(
      switchMap(data => {
        return this.http.post<Charge>(url, {
          amount,
          sourceId: data.source.id
        });
      })
    );
  }
  // Saves a payment source to the user account that can be charged later
  attachSource(card: any): Observable<Source> {
    const url = `${this.api}/sources/`;

    return fromPromise<Source>(this.stripe.createSource(card)).pipe(
      switchMap(data => {
        return this.http.post<Source>(url, { sourceId: data.source.id });
      })
    );
  }
  ///// SUBSCRIPTION ACTIONS ////
  // Attaches subscription to user (Stripe will charge the source)
  attachSubscription(
    sourceId: string,
    planId: string
  ): Observable<SubscriptionPlan> {
    const url = `${this.api}/subscriptions/`;

    return this.http.post<SubscriptionPlan>(url, { sourceId, planId });
  }

  // Cancels subscription
  cancelSubscription(planId: string): Observable<SubscriptionPlan> {
    const url = `${this.api}/subscriptions/cancel`;
    return this.http.put<SubscriptionPlan>(url, { planId });
  }
}
