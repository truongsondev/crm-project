import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { passwordValidator } from '@app/helper/password-validator';
import { AuthService } from '@app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'sign-in-component',
  templateUrl: './sign-in.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SignInComponent {
  LoginFormGroup!: FormGroup;
  initLoginForm() {
    this.LoginFormGroup = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', [Validators.required, passwordValidator]],
    });
  }
  private cookieService = inject(CookieService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.initLoginForm();
  }
  onNavigate() {
    this.router.navigate(['/auth/sign-up']);
  }
  onSubmit() {
    if (this.LoginFormGroup.valid) {
      const { user_name, password } = this.LoginFormGroup.value;
      this.authService.signIn({ user_name, password }).subscribe({
        next: (res) => {
          if (res.code === 20000) {
            this.cookieService.set('at', res.metadata.token.accessToken, {
              expires: 2,
              path: '/',
            });
            this.cookieService.set('rt', res.metadata.token.accessToken, {
              expires: 7,
              path: '/',
            });
            localStorage.setItem('user', JSON.stringify(res.metadata.user));
            this.router.navigate(['/dashboard']);
          } else {
            alert('login fail');
          }
        },
        error: (err) => {
          console.error('HTTP Error:', err);
          alert('Server error!');
        },
      });
    } else {
      this.LoginFormGroup.markAllAsTouched();
    }
  }
}
