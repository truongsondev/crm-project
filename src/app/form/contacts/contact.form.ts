import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Inject,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormContact, SelectOption } from '@app/custom-types/shared.type';
import { CommonModule } from '@angular/common';
import { UserService } from '@app/services/user.service';
import { User } from '@app/interfaces/user.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SALUTATION } from '@app/constants/shared.constant';
import { ContactService } from '@app/services/contact.service';

import { MatDialogRef } from '@angular/material/dialog';
import { UserForm } from '../user/user.form';
import { SnackbarService } from '@app/services/snackbar.service';

@Component({
  selector: 'contact-form',
  templateUrl: './contact.form.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  protected readonly value = signal('');

  contactFormGroup!: FormGroup;
  salutations: SelectOption[] = SALUTATION;
  leadSource: string[] = [
    'Existing Customer',
    'Partner',
    'Conference',
    'Website',
    'Word of mouth',
    'Other',
  ];
  listAssign: User[] = [];
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private contactService: ContactService,
    private dialogRef: MatDialogRef<UserForm>,
    private snackbarService: SnackbarService,
    @Inject('data') public contact: FormContact,
  ) {
    this.getListUser();
  }

  ngOnInit() {
    const contactForm = this.contact.dataSelected;
    console.log(contactForm);
    this.contactFormGroup = this.fb.group({
      _id: [contactForm?._id || ''],
      contact_name: [contactForm?.contact_name || '', Validators.required],
      salutation: [contactForm?.salutation || 'None', Validators.required],
      phone: [contactForm?.phone, Validators.required],
      email: [contactForm?.email, Validators.email],
      organization: [contactForm?.organization],
      birthday: [contactForm?.birthday || null],
      lead_source: [contactForm?.lead_source || '', Validators.required],
      assigned_to: [contactForm?.assigned_to || '', Validators.required],
      address: [contactForm?.address || ''],
      description: [contactForm?.description || ''],
    });
  }
  getRole() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return '';
    const user = JSON.parse(userJson);
    return user.role;
  }

  getListUser() {
    const role = this.getRole();
    if (!role) return;
    this.userService.getListUser().subscribe((data) => {
      const { users } = data;
      if (role === 'USER_ADMIN' || role === 'CONTACT_MGR') {
        this.listAssign = users.filter((item) =>
          ['CONTACT_MGR', 'CONTACT_EMP'].includes(item.role),
        );
      } else if (role === 'CONTACT_EMP') {
        this.listAssign = users.filter((item) =>
          ['CONTACT_EMP '].includes(item.role),
        );
      }
    });
  }
  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }

  onSubmit() {
    if (this.contactFormGroup.invalid) {
      this.contactFormGroup.markAllAsTouched();
      console.warn('Form is invalid', this.contactFormGroup.value);
      this.snackbarService.openSnackBar('Form invalid!');
      return;
    }
    if (this.contact.action === 'create') {
      const { _id, ...data } = this.contactFormGroup.value;
      this.contactService.createContact(data).subscribe((res) => {
        this.snackbarService.openSnackBar('Create contact success');
        this.dialogRef.close();
      });
    } else if (this.contact.action === 'update') {
      const data = this.contactFormGroup.value;
      const _id = data._id;
      this.contactService.updateContact(_id, data).subscribe({
        next: (res) => {
          this.snackbarService.openSnackBar('Update contact success');
          this.dialogRef.close();
        },
      });
    }
  }
}
