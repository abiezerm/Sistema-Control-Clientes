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
    public _auth: AngularFireAuth,
    private _db: AngularFirestore,
    private _router: Router
  ) {
    this.user$ = this._auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.UserId = user.uid;
          this.userLogeedin = true;
          return this._db.doc<User>(`Users/${user.uid}`).valueChanges();
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
    return this._db.doc(`Users/${userCredentials.user.uid}`).set({
      uid: userCredentials.user.uid,
      email: userCredentials.user.email,
      fullName: this.newUser.fullName,
    });
  }

  //Create Account
  async createAccount(user) {
    try {
      await this._auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((user) => {
          if (user) {
            this.newUser.uid = user.user.uid;
            this.InsertData(user);
            this._router.navigateByUrl('/login');
          }
          return user;
        });
    } catch (e) {
      const errorCodes = e.code;
      switch (errorCodes) {
        case 'auth/invalid-email':
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Dirección de correo inválida',
          });
        case 'auth/email-already-in-use':
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Dirección de correo en uso',
          });
          break;
        case 'auth/weak-password':
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La contraseña debe tener al menos 6 caractéres',
          });
          break;
      }
    }
  }

  //Create user User
  CreateUser() {
    return this._db.doc(`Users/${this.newUser.uid}`).set({
      uid: this.newUser.uid,
    });
  }
  //Log into the account
  async LoginAccount(email, password) {
    try {
      const user = await this._auth.signInWithEmailAndPassword(email, password);

      // User Loged in
      this._router.navigateByUrl('/home');
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
    await this._auth.signOut();
    this._router.navigateByUrl('');
  }
}
