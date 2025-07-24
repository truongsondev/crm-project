import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
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
import { SALUTATION } from '@app/constants/value.constant';
import { ContactService } from '@app/services/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PizzaPartyAnnotatedComponent } from '@app/shares/toast/toast.component';
import { MatDialogRef } from '@angular/material/dialog';
import { UserForm } from '../user/user.form';

@Component({
  selector: 'contact-form',
  templateUrl: './contact.form.html',
  styleUrl: 'contact.form.css',
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
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 2;

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
      duration: this.durationInSeconds * 1000,
      data: message,
    });
  }
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
      const { code, users } = data;
      if (code === 200000) {
        if (role === 'USER_ADMIN' || role === 'CONTACT_MGR') {
          this.listAssign = users.filter((item) =>
            ['CONTACT_MGR', 'CONTACT_EMP'].includes(item.role),
          );
        } else if (role === 'CONTACT_EMP') {
          this.listAssign = users.filter((item) =>
            ['CONTACT_EMP '].includes(item.role),
          );
        }
      }
    });
  }
  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }

  onSubmit() {
    if (this.contact.action === 'create') {
      if (this.contactFormGroup.invalid) {
        this.contactFormGroup.markAllAsTouched();
        console.warn('Form is invalid', this.contactFormGroup.value);
        return;
      }

      const data = this.contactFormGroup.value;
      delete data._id;
      this.contactService.createContact(data).subscribe((res) => {
        const { code } = res;
        if (code === 200000) {
          this.openSnackBar('Create contact success');
          this.dialogRef.close();
        } else {
          this.openSnackBar('Create contact fail');
        }
      });
    } else if (this.contact.action === 'update') {
      if (this.contactFormGroup.invalid) {
        this.contactFormGroup.markAllAsTouched();
        console.warn('Form is invalid', this.contactFormGroup.value);
        return;
      }
      const data = this.contactFormGroup.value;

      const _id = data._id;
      this.contactService.updateContact(_id, data).subscribe({
        next: (res) => {
          console.log(res);
          const { code } = res;
          console.log(res);
          if (code === 200000) {
            this.openSnackBar('Update contact success');
            this.dialogRef.close();
          } else {
            this.openSnackBar('Update contact fail');
          }
        },
        error: (err) => {
          this.openSnackBar('Update contact fail');
          console.error('err:::', err);
        },
      });
    }
  }
}
