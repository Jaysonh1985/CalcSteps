import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  snapshotChanges
} from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { retry } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs/Observable";

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
    private afAuth: AngularFireAuth,
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
    return this.db.object(`users/${uid}/enterprise-membership/status`);
 }
  processPayment(token: any) {
    return this.db
      .object(`/users/${this.userDetails.uid}/enterprise-membership`)
      .update({ token: token.id });
  }
}
