import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormInputComponent } from '@app/shares/input_form/input.component';
import {
  confirmPasswordValidator,
  passwordValidator,
} from '@app/helper/password-validator';
import { UserService } from '@app/services/user.service';
@Component({
  standalone: true,
  selector: 'form-field-hint',
  templateUrl: './user.form.html',
  styleUrl: './user.form.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  form: FormGroup;
  protected readonly value = signal('');
  private _formBuilder = inject(FormBuilder);

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }

  isChecked = true;
  formGroup = this._formBuilder.group({
    enableWifi: '',
    acceptTerms: ['', Validators.requiredTrue],
  });

  isCheckedDate = true;

  alertFormValues(formGroup: FormGroup) {
    console.log(JSON.stringify(formGroup.value, null, 2));
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.form = this.fb.group(
      {
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        user_name: ['', Validators.required],
        password: ['', [Validators.required, passwordValidator]],
        confirm_password: ['', [Validators.required, passwordValidator]],
        address: [''],
        salutation: ['', Validators.required],
        role: ['', Validators.required],
        hired_date: [null],
        job_title: [''],
        active: [true],
        manager: [false],
      },
      {
        Validators: confirmPasswordValidator(),
      },
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Form is invalid:', this.form.errors);
      return;
    }
    const res = this.userService.createUser(this.form.value);
    console.log(res);
  }
}
