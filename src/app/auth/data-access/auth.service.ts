import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
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

  signInWithGoogle() {
    const providerGoogle = new GoogleAuthProvider();

    return signInWithRedirect(this._auth, providerGoogle);
  }
}
