import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { UserValidator } from '@app/validators/user.validator';

@Component({
  selector: 'sign-in-component',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AuthComponent {
  loginFormGroup!: FormGroup;
  initLoginForm() {
    this.loginFormGroup = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', [Validators.required, UserValidator.password]],
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.initLoginForm();
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginFormGroup.valid) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      const { user_name, password } = this.loginFormGroup.value;
      this.authService.signIn({ user_name, password }).subscribe({
        next: (res) => {
          const accessToken = res.data.token.accessToken;
          const refreshToken = res.data.token.refreshToken;
          const expiry = Date.now() + 60 * 1000;
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('token_expiry', expiry.toString());
          this.router.navigate(['/']);
        },
      });
    } else {
      this.loginFormGroup.markAllAsTouched();
    }
  }
}
