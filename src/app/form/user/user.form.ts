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
import {
  confirmPasswordValidator,
  passwordValidator,
} from '@app/helper/password-validator';
import { UserService } from '@app/services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormUser,
  ListFormUser,
  SelectOption,
} from '@app/custom-types/shared.type';
import { CommonModule } from '@angular/common';
import { ErrorMessagePipe } from '@app/helper/error-message-form';
import { User } from '@app/interfaces/user.interface';
import { terminatedAfterHiredValidator } from '@app/helper/date-validator';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PizzaPartyAnnotatedComponent } from '@app/shares/toast/toast.component';
import { SALUTATION } from '@app/constants/value.constant';

@Component({
  standalone: true,
  selector: 'user-form',
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
    MatCheckboxModule,
    CommonModule,
    ErrorMessagePipe,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  userFormGroup!: FormGroup;
  isTerminated = false;
  salutations: SelectOption[] = SALUTATION;

  roles: SelectOption[] = [
    { value: 'USER_ADMIN', label: 'Admin' },
    { value: 'DIR', label: 'Director' },
    { value: 'SALES_MGR', label: 'Sales Manager' },
    { value: 'SALES_EMP', label: 'Sales Person' },
    { value: 'CONTACT_MGR', label: 'Contact Manager' },
    { value: 'CONTACT_EMP', label: 'Contact Employee' },
    { value: 'USER_READ_ONLY', label: 'Guest' },
  ];
  isChecked = true;

  isCheckedDate = true;

  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 2;

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
      duration: this.durationInSeconds * 1000,
      data: message,
    });
  }
  listManager: User[] = [];
  protected readonly value = signal('');
  // private readonly _formBuilder = inject(FormBuilder);

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Inject('data') public user: FormUser,
    @Inject('listData') public listUser: ListFormUser,
    private dialogRef: MatDialogRef<UserForm>,
  ) {}

  alertFormValues(formGroup: FormGroup) {
    console.log(JSON.stringify(formGroup.value, null, 2));
  }

  initForm = () => {
    this.userFormGroup = this.fb.group(
      {
        _id: [this.user.dataSelected?._id || ''],
        first_name: [
          this.user.dataSelected?.first_name || '',
          Validators.required,
        ],
        last_name: [
          this.user.dataSelected?.last_name || '',
          Validators.required,
        ],
        username: [this.user.dataSelected?.username || '', Validators.required],
        email: [
          this.user.dataSelected?.email || '',
          [Validators.required, Validators.email],
        ],
        password: ['', [Validators.required, passwordValidator]],
        confirm_password: ['', [Validators.required]],
        address: [this.user.dataSelected?.address || ''],
        salutation: [
          this.user.dataSelected?.salutation || 'None',
          Validators.required,
        ],
        role: [this.user.dataSelected?.role || '', Validators.required],
        hired_date: [this.user.dataSelected?.hired_date || null],
        job_title: [this.user.dataSelected?.job_title || ''],
        is_active: [this.user.dataSelected?.is_active ?? true],
        is_manager: [this.user.dataSelected?.is_manager ?? false],
        manager_name: [this.user.dataSelected?._id || '', Validators.required],
        is_terminate: [false],
        terminated_date: [
          {
            value: this.user.dataSelected?.terminated_date || null,
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
      this.listUser.userList?.filter((item) => item.is_manager) || [];
    this.initForm();
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
      const dataReq = { ...this.userFormGroup.value };
      delete dataReq.is_terminate;
      delete dataReq.confirm_password;

      if (this.user.action === 'create') {
        delete dataReq._id;

        this.userService.updateUser(dataReq._id, dataReq).subscribe({
          next: (res) => {
            console.log(res);
            const { code } = res;
            if (code === 200000) {
              this.openSnackBar('Create user success');
              this.dialogRef.close();
            }
          },
          error: (err) => {
            alert('Update user fail');
            console.error(err);
          },
        });
      } else if (this.user.action === 'update') {
        this.userService.updateUser(dataReq._id, dataReq).subscribe({
          next: (res) => {
            console.log(res);
            const { code } = res;
            if (code === 200000) {
              this.openSnackBar('update user success');
              this.dialogRef.close();
            }
          },
          error: (err) => {
            alert('Update user fail');
            console.error(err);
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
