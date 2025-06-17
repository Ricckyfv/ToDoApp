import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { isRequired, hasEmailError } from '../../utils/validators';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { GoogleButtonComponent } from '../../ui/google-button/google-button.component';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { updateProfile } from '@angular/fire/auth';

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  phone?: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export default class SignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _authStateService = inject(AuthStateService);

  form = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', Validators.required),
    phone: this._formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^\d{9}$/),
    ]),
  });

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      const { email, password, phone } = this.form.value;

      if (!email || !password || !phone) return;

      await this._authService.signUp({
        email,
        password,
      });

      await this._authStateService.logOut();

      toast.success('Usuario creado correctamente!');
      this._router.navigateByUrl('/auth/sign-in');
    } catch (error) {
      toast.error('Error al crear usuario. Intentalo mas tarde.');
    }
  }

  async submitWithGoogle() {
    try {
      await this._authService.signInWitGoogle();
      toast.success('Bienvenido!');
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Error. Intentalo mas tarde.');
    }
  }
}
