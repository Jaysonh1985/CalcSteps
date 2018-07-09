import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";

import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import * as firebase from "firebase/app";
import { Observable } from "rxjs";

@Injectable()
export class PaymentsService {
  userId: string;
  membership: any;
  membershipStatus: string;
  switchMap: [any];
  userFirebase: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
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
