import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
  authState
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
  public authState$ = authState(this._auth);

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

  async checkRedirect() {
    try {
      // Firebase revisa si la página se cargó porque Google nos devolvió aquí
      const result = await getRedirectResult(this._auth);

      if (result && result.user) {
        // Si hay un usuario, significa que el login por redirección fue un éxito
        return true;
      }
      return false; // No venimos de una redirección o no hay usuario
    } catch (error) {
      console.error('Error al procesar la redirección de Google:', error);
      return false;
    }
  }
}
