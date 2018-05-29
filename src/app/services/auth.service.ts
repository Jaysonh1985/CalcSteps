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
import { CalculationService } from "../calculation/shared/services/calculation.service";

export class User {
  uid: string;
  displayName: string;
  email: string;
  constructor(auth) {
    this.uid = auth.uid;
    this.displayName = auth.displayName;
    this.email = auth.email;
  }
}

@Injectable()
export class AuthService {
  private userDetails: firebase.User = null;
  userFirebase: Observable<firebase.User>;
  userRef: AngularFireList<User> = null;
  customerRef: AngularFireList<any> = null;
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private calcService: CalculationService
  ) {
    this.userFirebase = firebaseAuth.authState;
    this.userFirebase.subscribe(user => {
      if (user) {
        this.userDetails = user;
      } else {
        this.userDetails = null;
      }
    });
  }
  signup(email: string, password: string, name: string) {
    const saveName = name;
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(
      email,
      password
    );
  }
  login(email: string, password: string) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }
  signInWithGoogle() {
    return this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(newUser => {
        const user: User = {
          uid: newUser.uid,
          displayName: newUser.displayName,
          email: newUser.email
        };
        this.createUser(user);
      })
      .catch(error => console.log(error));
  }
  isLoggedIn() {
    this.firebaseAuth.auth.onAuthStateChanged(function(user) {
      if (user) {
        return true;
      } else {
        return false;
      }
    });
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
  deleteUser(): void {
    this.userDetails.delete().then(() => this.router.navigate(["home"]));
  }
  public createUser(user: User) {
    this.updateDisplayName(user.displayName);
    const path = `users/${user.uid}`; // Endpoint on firebase
    const data = {
      name: user.displayName,
      email: user.email
    };
    return this.db
      .object(path)
      .update(data)
      .catch(error => console.log(error));
  }
  public updateDisplayName(name: string) {
    return this.firebaseAuth.auth.currentUser
      .updateProfile({
        displayName: name,
        photoURL: ""
      })
      .then(function() {}, function(error) {});
  }
}
