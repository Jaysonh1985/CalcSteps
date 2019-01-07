import { map, retry } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import * as firebase from "firebase/app";
import { Observable, from as fromPromise } from "rxjs";
import { CalculationService } from "../../calculation/shared/services/calculation.service";
import { ReleaseService } from "../../calculation/shared/services/release.service";

export class User {
  uid: string;
  displayName?: string;
  email: string;
  photoUrl?: string;
  customerId?: string;
  subscriptions?: {
    [key: string]: "active" | "pastDue" | "cancelled";
  };
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
    private calcService: CalculationService,
    private releaseService: ReleaseService
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
  anonymousLogin() {
    return this.firebaseAuth.auth
      .signInAnonymously()
      .then(() => console.log("successful login"))
      .catch(error => console.log(error));
  }
  signInWithGoogle() {
    return this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(newUser => {
        const user: User = {
          uid: newUser.user.uid,
          displayName: newUser.user.displayName,
          email: newUser.user.email
        };
        this.createUser(user);
      })
      .catch(error => console.log(error));
  }
  isLoggedIn(): boolean {
    this.firebaseAuth.auth.onAuthStateChanged(function(user) {
      if (user) {
        return true;
      } else {
        return false;
      }
    });
    return false;
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
  deleteUser(userProvidedPassword): void {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      userProvidedPassword
    );
    this.userDetails.reauthenticateWithCredential(credential).then(() => {
      this.deleteUserCalcs();
      this.userDetails.delete().then(() => this.router.navigate(["home"]));
    });
  }
  deleteUserCalcs(): void {
    this.calcService
      .getCalculationListbyuid(this.userDetails.uid)
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        })
      )
      .subscribe(calculations => {
        calculations.forEach(element => {
          this.releaseService
            .getReleaseListbycalculationKey(element.key)
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
          this.calcService.deleteCalculation(element.key);
        });
      });
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
  // Used by the http interceptor to set the auth header
  getUserIdToken(): Observable<string> {
    return fromPromise(this.firebaseAuth.auth.currentUser.getIdToken());
  }
}
