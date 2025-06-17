import { Name } from './../../../../node_modules/angular-cli-ghpages/node_modules/ajv/lib/compile/codegen/code';
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, //sirve para logearse con algun proveedor como Google, GitHub, etc.
  GoogleAuthProvider,
} from '@angular/fire/auth';

export interface User {
  email: string;
  password: string;
  phone?: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);

  signUp(user: User) {
    return createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.password,
    );
  }

  signIn({ email, password }: { email: string; password: string }) {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  signInWitGoogle() {
    const providerGoogle = new GoogleAuthProvider();

    return signInWithPopup(this._auth, providerGoogle);
  }
}
