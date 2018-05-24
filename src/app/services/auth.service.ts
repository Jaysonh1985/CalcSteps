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
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
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
    return this.firebaseAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then()
      .catch(error => console.log(error));
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
  deleteUser(): void {
    this.userDetails.delete();
    this.userRef = this.db.list(`users`);
    this.userRef
      .remove(this.userDetails.uid)
      .then(() => this.router.navigate(["home"]))
      .catch(error => console.log(error));
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
