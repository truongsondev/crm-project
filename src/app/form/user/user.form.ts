import {
  ChangeDetectionStrategy,
  Component,
  signal,
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
import {
  confirmPasswordValidator,
  passwordValidator,
} from '@app/helper/password-validator';
import { UserService } from '@app/services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormUser, SelectOption } from '@app/custom-types/shared.type';
import { CommonModule } from '@angular/common';
import { ErrorMessagePipe } from '@app/helper/error-message-form';
import { User } from '@app/interfaces/user.interface';
import { terminatedAfterHiredValidator } from '@app/helper/date-validator';
import { MatDialogRef } from '@angular/material/dialog';
import { ROLES, SALUTATION } from '@app/constants/shared.constant';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '@app/services/snackbar.service';
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
    ErrorMessagePipe,
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
    console.log('userSelected:::', userSelected);
    this.userFormGroup = this.fb.group(
      {
        _id: [userSelected?._id || ''],
        first_name: [userSelected?.first_name || '', Validators.required],
        last_name: [userSelected?.last_name || '', Validators.required],
        username: [userSelected?.username || '', Validators.required],
        email: [
          userSelected?.email || '',
          [Validators.required, Validators.email],
        ],
        password: [
          userSelected?.password || '',
          [Validators.required, passwordValidator],
        ],
        confirm_password: [userSelected?.password || '', [Validators.required]],
        address: [userSelected?.address || ''],
        salutation: [userSelected?.salutation || 'None', Validators.required],
        role: [userSelected?.role || '', Validators.required],
        hired_date: [userSelected?.hired_date || null],
        job_title: [userSelected?.job_title || ''],
        is_active: [userSelected?.is_active ?? true],
        is_manager: [userSelected?.is_manager ?? false],
        manager_name: [userSelected?.manager_name || '', Validators.required],
        is_terminate: [false],
        terminated_date: [
          {
            value: userSelected?.terminated_date || null,
            disabled: true,
          },
        ],
      },
      {
        validators: [confirmPasswordValidator, terminatedAfterHiredValidator],
      },
    );
  };

  ngOnInit() {
    this.listManager =
      this.user.dataList?.filter((item) => item.is_manager) || [];
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

  onSubmit() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
      console.warn('Form is invalid', this.userFormGroup.value);
      return;
    }
    try {
      const { is_terminate, confirm_password, ...dataReq } =
        this.userFormGroup.value;
      if (this.user.action === 'create') {
        const { _id, ...requestBody } = dataReq;
        this.userService.createUser(requestBody).subscribe({
          next: (res) => {
            this.snackbarService.openSnackBar('Create user success');
            this.dialogRef.close();
          },
          error: () => {
            this.snackbarService.openSnackBar('Create user fail!');
          },
        });
      } else if (this.user.action === 'update') {
        this.userService.updateUser(dataReq._id, dataReq).subscribe({
          next: (res) => {
            this.snackbarService.openSnackBar('update user success');
            this.dialogRef.close();
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
