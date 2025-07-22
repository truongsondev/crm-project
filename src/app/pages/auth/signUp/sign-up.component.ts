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

@Component({
  selector: 'sign-up-component',
  standalone: true,
  templateUrl: './sign-up.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class SignUpComponent {
  LoginFormGroup!: FormGroup;
  initLoginForm() {
    this.LoginFormGroup = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', [Validators.required, passwordValidator]],
    });
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.initLoginForm();
  }
  onNavigate() {
    this.router.navigate(['/auth/sign-in']);
  }
  onSubmit() {
    if (this.LoginFormGroup.valid) {
      console.log(this.LoginFormGroup.value);
    } else {
      this.LoginFormGroup.markAllAsTouched();
    }
  }
}
