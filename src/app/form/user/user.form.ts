import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  Inject,
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from '@app/interfaces/user.interface';
import { formUser } from '@app/custom-types/shared.type';
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
    MatCheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  form: FormGroup;
  isTerminate = false;
  protected readonly value = signal('');
  private readonly _formBuilder = inject(FormBuilder);

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
    @Inject('user') public user: formUser,
  ) {
    this.form = this.fb.group({
      id: [user.user?.id || ''],
      first_name: [user.user?.first_name || '', Validators.required],
      last_name: [user.user?.last_name || '', Validators.required],
      user_name: [user.user?.user_name || '', Validators.required],
      email: [user.user?.email || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirm_password: ['', [Validators.required, passwordValidator]],
      address: [user.user?.address || ''],
      salutation: [user.user?.salutation || 'none', Validators.required],
      role: [user.user?.role || '', Validators.required],
      hired_date: [user.user?.hired_date || null],
      job_title: [user.user?.job_title || ''],
      active: [user.user?.active ?? true],
      manager: [user.user?.manager ?? false],
      manager_name: [user.user?.manager_name || ''],
      is_terminate: [false],
      terminated_date: [
        { value: user.user?.terminated_date || null, disabled: true },
      ],
    });
  }

  onToggleTerminated() {
    const dateControll = this.form.get('terminated_date');
    if (!this.isTerminate) {
      dateControll?.disable;
    } else {
      dateControll?.enable;
      dateControll?.reset;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Form is invalid', this.form.value);
      return;
    }
    try {
      const dataReq = { ...this.form.value };
      console.log('dataReq:::', dataReq);
      delete dataReq.is_terminate;
      if (this.user.action === 'create') {
        const res = this.userService.createUser(dataReq);
      } else if (this.user.action === 'update') {
        this.userService.updateUser(dataReq.id, dataReq);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
