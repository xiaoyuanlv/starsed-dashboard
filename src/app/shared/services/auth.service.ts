import { Injectable, NgZone } from "@angular/core";
import { FirebaseApp } from "@angular/fire";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { MemberService } from "../services/member.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    public mservice : MemberService // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user != null) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user") as string);
      } else {
        localStorage.setItem("user", "");
        JSON.parse(localStorage.getItem("user") as string);
      }
    });
  }

  SignUp(
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((value) => {
        if (value.user != null) {
          value.user.sendEmailVerification();
          if (value.user) {
            value.user
              .updateProfile({
                displayName: displayName,
                photoURL: photoURL,
              })
              .then((s) => {
                window.alert("Success. Please verify your email.");
                this.router.navigate(["/auth/signin"]);
              });
          }
        } else {
          window.alert("Sorry. Please try again.");
        }
      })
      .catch((err) => {
        console.log("Something went wrong:", err.message);
      });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.userData = result.user;
        localStorage.setItem("user", JSON.stringify(this.userData));

        this.ngZone.run(() => {
          const user = JSON.parse(localStorage.getItem("user") as string);
          // window.alert(user.displayName);
          if (user !== null) {
            window.location.reload();
          } else {
            window.alert("Invalid User");
          }
        });

      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user") as string);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          window.location.reload();
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef = this.afs.doc("users/" + user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("user");
      window.alert("See You");
      this.router.navigate(['/auth/login']);
    });
  }

  ChangePassword(email, oldpassword, nwpassword) {
    return this.afAuth
      .signInWithEmailAndPassword(email, oldpassword)
      .then((result) => {
        if (result.user != null) {
          this.ngZone.run(() => {
            result.user.updatePassword(nwpassword);
            this.SetUserData(result.user);
            this.userData = result.user;
            localStorage.setItem("user", JSON.stringify(this.userData));
            window.alert("success");
          });
        } else {
          window.alert("Invalid");
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  UpdateUserProfile(displayName, photoURL) {
    this.afAuth.authState.subscribe((user) => {
      if (user != null) {
        user.displayName = displayName;
        user.photoURL = photoURL;
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user") as string);
      } else {
        localStorage.setItem("user", "");
        JSON.parse(localStorage.getItem("user") as string);
      }
    });
  }

  DeleteAcc() {
    this.afAuth.authState.subscribe((user) => {

      if (user != null) {
        this.mservice.DeleteAcc(user.uid, user.email);
          user.delete().then(function() {
            localStorage.removeItem("user");
            window.alert("See You");
            this.router.navigate(['/auth/login']);
          }).catch(function(error) {
            window.alert(error);
          });
      }

    });
  }

}
