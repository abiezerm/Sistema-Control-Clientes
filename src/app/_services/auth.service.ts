import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  newUser: User; //Save current user data
  UserId: string; //save user id
  user$: Observable<User>; //an observable with the authstate
  userLogeedin: boolean = false;
  user = {} as User;

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.UserId = user.uid;
          this.userLogeedin = true;
          return this.db.doc<User>(`Users/${user.uid}`).valueChanges();
        } else {
          console.log('no logeado');
          return of(null);
        }
      })
    );
  }

  assignUser(user) {
    this.newUser = user;
    console.log(user, this.newUser);
  }

  //Insert the user data into a collection
  InsertData(userCredentials: firebase.default.auth.UserCredential) {
    console.log(this.newUser);
    return this.db.doc(`Users/${userCredentials.user.uid}`).set({
      uid: userCredentials.user.uid,
      email: userCredentials.user.email,
      fullName: this.newUser.fullName,
    });
  }

  //Create Account
  async createAccount(user) {
    try {
      await this.auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((user) => {
          if (user) {
            this.newUser.uid = user.user.uid;
            this.InsertData(user);
            // this.VerificationCode();
            // this.router.navigateByUrl('/verification-email');
          }

          return user;
        });
    } catch (e) {
      const errorCodes = e.code;
      switch (errorCodes) {
        case 'auth/invalid-email':
        // const invalidEmail = await this.Toast.create({
        //   message: 'Dirección de correo inválida',
        //   duration: 3000,
        // });
        // invalidEmail.present();
        // break;
        case 'auth/email-already-in-use':
        // const emailInUse = await this.Toast.create({
        //   message: 'Correo en uso',
        //   duration: 3000,
        // });
        // emailInUse.present();
        // break;
      }
    }
  }

  //Create user User
  CreateUser() {
    return this.db.doc(`Users/${this.newUser.uid}`).set({
      uid: this.newUser.uid,
    });
  }
  //Log into the account
  async LoginAccount(email, password) {
    try {
      const user = await this.auth.signInWithEmailAndPassword(email, password);
      // if (user && user.user.emailVerified) {
      // Signed in
      this.router.navigateByUrl('/home');
      // }
      // if (user && user.user.emailVerified) {
      //   // Signed in
      //   //console.log(this.user$.subscribe(x=> x.username))
      //   console.log(user.user.emailVerified);
      //   const Login = await this.Toast.create({
      //     message: "Iniciando sesión en su cuenta",
      //     duration: 2500,
      //   });
      //   Login.present();
      //   this.router.navigateForward("/tabs/tab1");

      // ...
      // } else if (user) {
      //   console.log(user.user.emailVerified);

      //   this.router.navigateByUrl(["/verification-email"]);
      // }
    } catch (e) {
      const errorCodes = e.code;
      switch (errorCodes) {
        case 'auth/invalid-email':
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Dirección de correo inválida o vacía',
          });
          break;
        case 'auth/user-not-found':
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Dirección de correo no registrada',
          });
          break;
        case 'auth/wrong-password':
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La contraseña es incorrecta',
          });
          break;
      }
    }
  }

  //Logout the account
  async onLogout() {
    this.userLogeedin = false;
    await this.auth.signOut();
    this.router.navigateByUrl('');
  }
}
