import {
  ChangeDetectionStrategy,
  Component,
  signal,
  Inject,
  EventEmitter,
  Output,
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

import { UserService } from '@app/services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormUser, SelectOption } from '@app/custom-types/shared.type';
import { CommonModule } from '@angular/common';
import { User } from '@app/interfaces/user.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { ROLES, SALUTATION } from '@app/constants/shared.constant';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '@app/services/snackbar.service';
import { ACTION } from '@app/constants/shared.constant';
import { UserValidator } from '@app/validators/user.validator';
@Component({
  standalone: true,
  selector: 'user-form',
  templateUrl: './user.form.html',
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
    MatCheckboxModule,
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  userFormGroup!: FormGroup;
  isTerminated = false;
  salutations: SelectOption[] = SALUTATION;
  isPasswordHidden = true;
  roles: SelectOption[] = ROLES;
  isChecked = true;
  @Output() formSubmit = new EventEmitter<any>();

  isCheckedDate = true;

  listManager: User[] = [];
  protected readonly value = signal('');

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Inject('data') public user: FormUser,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<UserForm>,
  ) {}

  initForm = () => {
    const userSelected = this.user.dataSelected;
    this.userFormGroup = this.fb.group({
      first_name: [userSelected?.first_name || '', Validators.required],
      last_name: [userSelected?.last_name || '', Validators.required],
      username: [userSelected?.username || '', Validators.required],
      email: [
        userSelected?.email || '',
        [Validators.required, Validators.email],
      ],
      password: [
        userSelected?.password || '',
        [Validators.required, UserValidator.password],
      ],
      confirm_password: [
        userSelected?.password || '',
        [Validators.required, UserValidator.mustMatch('password')],
      ],
      address: [userSelected?.address || ''],
      salutation: [userSelected?.salutation || 'None', Validators.required],
      role: [userSelected?.role || '', Validators.required],
      hired_date: [userSelected?.hired_date || null],
      job_title: [userSelected?.job_title || ''],
      is_active: [userSelected?.is_active ?? true],
      is_manager: [userSelected?.is_manager ?? false],
      manager_name: [userSelected?.manager_name?._id || ''],
      is_terminate: [false],
      terminated_date: [
        {
          value: userSelected?.terminated_date || null,
          disabled: true,
        },
        UserValidator.mustBeAfter('hired_date'),
      ],
    });
  };

  ngOnInit() {
    this.listManager =
      this.user.dataList?.filter((item) => item.is_manager) || [];
    console.log(this.listManager);
    this.initForm();
  }

  handleHiddenPassword() {
    this.isPasswordHidden = !this.isPasswordHidden;
  }

  onToggleTerminated() {
    this.isTerminated = this.userFormGroup.get('is_terminate')?.value;
    const dateControl = this.userFormGroup.get('terminated_date');
    if (!this.isTerminated) {
      dateControl?.disable();
    } else {
      dateControl?.enable();
      dateControl?.reset();
    }
  }
  getErrorMsg(controlName: string): string | null {
    const control = this.userFormGroup.get(controlName);
    if (!control || !control.errors || !control.touched) return null;
    if (control.errors['required']) {
      return 'This field is required';
    }
    if (control.errors['email']) {
      return 'Email must be in form abc@gmail.com';
    }
    if (control.errors['password']) {
      return 'Password must include A-Z, a-z, 1- 9, and (.!@#)';
    }

    if (control.errors['matching']) {
      return 'Passwords do not match';
    }
    if (control.errors['mustBeAfter']) {
      return 'Terminal date must be greater than hire date';
    }

    return 'Invalid input';
  }

  onSubmit() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
      return;
    }

    try {
      const { is_terminate, confirm_password, ...dataReq } =
        this.userFormGroup.value;
      if (this.user.action === ACTION.CREATE) {
        this.userService.createUser(dataReq).subscribe({
          next: (res) => {
            this.snackbarService.openSnackBar('Create user success');
            this.dialogRef.close({
              isSubmit: true,
            });
          },
          error: () => {
            this.snackbarService.openSnackBar('Create user fail!');
          },
        });
      } else if (this.user.action === ACTION.UPDATE) {
        this.userService
          .updateUser(this.user.dataSelected?._id || '', dataReq)
          .subscribe({
            next: (res) => {
              this.snackbarService.openSnackBar('update user success');
              this.dialogRef.close({
                isSubmit: true,
              });
            },
            error: () => {
              this.snackbarService.openSnackBar('Create user fail!');
            },
          });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
