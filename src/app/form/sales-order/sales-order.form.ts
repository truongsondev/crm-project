import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormSalesOrder } from '@app/custom-types/shared.type';
import { Contact } from '@app/interfaces/contact.interface';
import { User } from '@app/interfaces/user.interface';

@Component({
  standalone: true,
  selector: 'sales-order-form',
  templateUrl: './sales-order.form.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SalesOrderForm implements OnInit {
  salesOrderFormGroup!: FormGroup;
  listAssign: User[] = [];
  protected readonly value = signal('');
  listContact: Contact[] = [];

  private ORDER_NO_PATTERN = /^[a-zA-Z0-9_-]+$/;
  statusOption = ['Created', 'Approved', 'Delivered', 'Canceled'];
  constructor(
    @Inject('data') public salesOrder: FormSalesOrder,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  getErrorMsg(controlName: string): string | null {
    const control = this.salesOrderFormGroup.get(controlName);
    if (!control || !control.errors || !control.touched) return null;
    if (control.errors['required']) {
      return 'This field is required';
    }

    return 'Invalid input';
  }
  initForm = () => {
    const so = this.salesOrder?.dataSelected;

    this.salesOrderFormGroup = this.fb.group({
      _id: [so?._id || ''],
      order_number: [
        { value: so?.order_number || '', disabled: true },
        [Validators.required, Validators.pattern(this.ORDER_NO_PATTERN)],
      ],
      subject: [so?.subject || '', Validators.required],
      contact_id: [so?.contact_id || '', Validators.required],
      status: [so?.status || '', Validators.required],
      total: [
        so?.total || '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      assigned_to: [so?.assigned_to || '', Validators.required],
      description: [so?.description || ''],
    });
  };

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }

  onSubmit() {
    if (this.salesOrderFormGroup.invalid) {
      this.salesOrderFormGroup.markAllAsTouched();
      return;
    }
    const formValue = this.salesOrderFormGroup.getRawValue();
    console.log('Sales order submit:', formValue);
  }
}
