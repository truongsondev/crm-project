import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'sign-in-component',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AuthComponent {
  LoginFormGroup!: FormGroup;
  initLoginForm() {
    this.LoginFormGroup = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', [Validators.required]],
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
    const accessToken = localStorage.getItem('at');
    if (accessToken) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.LoginFormGroup.valid) {
      localStorage.clear();
      const { user_name, password } = this.LoginFormGroup.value;
      this.authService.signIn({ user_name, password }).subscribe({
        next: (res) => {
          console.log(res);
          const at = res.data.token.accessToken;
          const rt = res.data.token.refreshToken;
          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('at', at);
          localStorage.setItem('rt', rt);
          this.router.navigate(['/']);
        },
      });
    } else {
      this.LoginFormGroup.markAllAsTouched();
    }
  }
}
