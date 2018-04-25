import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  snapshotChanges
} from "angularfire2/database";

@Injectable()
export class AuthService {
  private userDetails: firebase.User = null;
  user: Observable<firebase.User>;
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {
    this.user = firebaseAuth.authState;
    this.user.subscribe(user => {
      if (user) {
        this.userDetails = user;
        console.log(this.userDetails);
      } else {
        this.userDetails = null;
      }
    });
  }
  signup(email: string, password: string) {
    return this.firebaseAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => this.updateUserData())
      .catch(error => console.log(error));
  }
  login(email: string, password: string) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }
  signInWithGoogle() {
    return this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.updateUserData())
      .catch(error => console.log(error));
  }
  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }
  logout() {
    this.firebaseAuth.auth.signOut().then(res => this.router.navigate(["/"]));
  }
  resetPassword(email: string) {
    return this.firebaseAuth.auth
      .sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch(error => console.log(error));
  }

  public updateUserData(): void {
    const path = `users/${this.userDetails.uid}`; // Endpoint on firebase
    const data = {
      name: this.userDetails.displayName,
      email: this.userDetails.email
    };

    this.db
      .object(path)
      .update(data)
      .catch(error => console.log(error));
  }
}
