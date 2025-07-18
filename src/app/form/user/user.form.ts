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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  userFormGroup!: FormGroup;
  isTerminated = false;
  salutations: SelectOption[] = [
    { value: 'none', label: 'None' },
    { value: 'mr', label: 'Mr.' },
    { value: 'mrs', label: 'Mrs.' },
    { value: 'dr', label: 'Dr.' },
    { value: 'prof', label: 'Prof.' },
  ];

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

  listManager: User[] = [];
  protected readonly value = signal('');
  private readonly _formBuilder = inject(FormBuilder);

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Inject('user') public user: FormUser,
    @Inject('listUser') public listUser: ListFormUser,
  ) {}

  alertFormValues(formGroup: FormGroup) {
    console.log(JSON.stringify(formGroup.value, null, 2));
  }

  handleSalutation(label: string | undefined | null): string | null {
    if (!label) {
      return null;
    }
    let labelLowCase = label.toLowerCase();
    if (labelLowCase.includes('.')) {
      labelLowCase = labelLowCase.slice(0, -1);
    }
    return labelLowCase;
  }

  initForm = () => {
    this.userFormGroup = this.fb.group(
      {
        id: [this.user.selectedUser?.id || ''],
        first_name: [
          this.user.selectedUser?.first_name || '',
          Validators.required,
        ],
        last_name: [
          this.user.selectedUser?.last_name || '',
          Validators.required,
        ],
        user_name: [
          this.user.selectedUser?.user_name || '',
          Validators.required,
        ],
        email: [
          this.user.selectedUser?.email || '',
          [Validators.required, Validators.email],
        ],
        password: ['', [Validators.required, passwordValidator]],
        confirm_password: ['', [Validators.required]],
        address: [this.user.selectedUser?.address || ''],
        salutation: [
          this.handleSalutation(this.user.selectedUser?.salutation) || 'none',
          Validators.required,
        ],
        role: [this.user.selectedUser?.role || '', Validators.required],
        hired_date: [this.user.selectedUser?.hired_date || null],
        job_title: [this.user.selectedUser?.job_title || ''],
        active: [this.user.selectedUser?.active ?? true],
        manager: [this.user.selectedUser?.manager ?? false],
        manager_name: [
          this.user.selectedUser?.manager_name || '',
          Validators.required,
        ],
        is_terminate: [false],
        terminated_date: [
          {
            value: this.user.selectedUser?.terminated_date || null,
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
      this.listUser.userList?.filter((item) => item.manager) || [];
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

      if (this.user.action === 'create') {
        if (!dataReq.id) {
          delete dataReq.id;
        }
        const data = { ...dataReq, created_time: new Date().toISOString() };
        this.userService.createUser(data).subscribe((res) => {
          console.log('Response:::', res);
        });
      } else if (this.user.action === 'update') {
        const data = {
          ...dataReq,
          created_time: this.user.selectedUser?.created_time,
          updated_time: new Date().toISOString(),
        };

        this.userService.updateUser(data.id, data).subscribe((res) => {
          console.log('Response:::', res);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
