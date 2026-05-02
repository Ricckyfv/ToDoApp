import { Component, inject, NgZone, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../data-access/auth.service';
import { isRequired, hasEmailError } from '../../utils/validators';
import { GoogleButtonComponent } from "../../ui/google-button/google-button.component";

interface FormSignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export default class SignInComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _zone = inject(NgZone);

  form = this._formBuilder.group<FormSignIn>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', Validators.required),
  });

  // 1. ngOnInit se ejecuta automáticamente al abrir la página de Login
  async ngOnInit() {

    console.log('1. Iniciando pantalla de Login...');

    // A. Nos suscribimos al estado de Firebase
    this._authService.authState$.subscribe((user) => {
      console.log('2. Estado de autenticación detectado:', user ? user.email : 'Ningún usuario activo');

      if (user) {
        // Obligamos a Angular a ejecutar esta navegación dentro de su ciclo de actualización
        this._zone.run(() => {
          console.log('3. Redirigiendo a /tasks mediante authState$...');
          this._router.navigate(['/tasks']);
        });
      }
    });

    console.log('4. Revisando si Google nos devolvió una redirección...');
    // B. Procesamos el resultado de la redirección
    const loginExitoso = await this._authService.checkRedirect();
    console.log('5. Resultado de checkRedirect:', loginExitoso);

    if (loginExitoso) {
      // Si checkRedirect es exitoso, también forzamos la navegación
      this._zone.run(() => {
        console.log('6. Redirigiendo a /tasks mediante checkRedirect...');
        this._router.navigate(['/tasks']);
      });
    }

  }

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }

  async submit() {
    if (this.form.invalid) return;

      try {
        const { email, password } = this.form.value;

        if (!email || !password) return;

        await this._authService.signIn({
          email,
          password,
        });

        toast.success('Has iniciado sesión correctamente.');
        this._router.navigateByUrl('/tasks');

      } catch (error) {
        toast.error('Error al crear el usuario. Intentalo mas tarde.');
      }
  }

    async submitWithGoogle() {
    try {
      await this._authService.signInWithGoogle();
      toast.success('Bienvenido!');
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Error. Intentalo mas tarde.');
      console.error('Error técnico de Firebase al loguear:', error);
    }
  }
}
