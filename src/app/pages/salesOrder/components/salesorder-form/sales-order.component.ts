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
import { SalesOrderTableState } from '@app/custom-types/shared.type';
import { User } from '@app/interfaces/user.interface';
import { ROLE_TYPE } from '@app/enums/shared.enum';
import { CommonService } from '@app/services/common.service';
import { UserService } from '@app/services/user.service';
import { ContactService } from '@app/services/contact.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Contact } from '@app/interfaces/contact.interface';
import { SalesOrderService } from '@app/services/sales-order.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@app/services/snackbar.service';
import { ACTION, STATUS_OPTION } from '@app/constants/shared.constant';

@Component({
  standalone: true,
  selector: 'sales-order-form',
  templateUrl: './sales-order.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SalesOrderForm {
  salesOrderFormGroup!: FormGroup;
  protected readonly value = signal('');

  listAssign$!: Observable<User[]>;
  listContact$!: Observable<Contact[]>;

  private ORDER_NO_PATTERN = /^[a-zA-Z0-9_-]+$/;
  statusOption = STATUS_OPTION;

  constructor(
    @Inject('data') public salesOrder: SalesOrderTableState,
    private fb: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    private contactService: ContactService,
    private salesOrderService: SalesOrderService,
    private dialogRef: MatDialogRef<SalesOrderForm>,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getListAssignedTo();
    this.getContacList();
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
    const so = this.salesOrder?.selectedRow;
    this.salesOrderFormGroup = this.fb.group({
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
    const creator_id = this.commonService.parseStringToJson('user')?._id;
    if (creator_id === '') {
      return;
    }
    const newDataform = {
      ...this.salesOrderFormGroup.value,
      creator_id: creator_id,
    };

    if (this.salesOrder.action === ACTION.CREATE) {
      this.salesOrderService.createSaleOrder(newDataform).subscribe({
        next: () => {
          this.snackbarService.openSnackBar('Create sale order success!');
          this.dialogRef.close({
            isSubmit: true,
          });
        },
        error: () => {
          this.snackbarService.openSnackBar('Create sale order fail!');
        },
      });
    } else if (this.salesOrder.action === ACTION.UPDATE) {
      this.salesOrderService
        .updateSalesOrder(this.salesOrder.selectedRow?._id || '', newDataform)
        .subscribe({
          next: () => {
            this.snackbarService.openSnackBar('Update success');
            this.dialogRef.close({
              isSubmit: true,
            });
          },
          error: () => {
            this.snackbarService.openSnackBar('Update fail');
            this.dialogRef.close({
              isSubmit: false,
            });
          },
        });
    }
  }

  getListAssignedTo() {
    const creator = this.commonService.parseStringToJson('user');
    if (creator === '') return;

    const role = creator.role;
    this.listAssign$ = this.userService.getListUser().pipe(
      map((res) => {
        const users = res;
        if (role === ROLE_TYPE.USER_ADMIN || role === ROLE_TYPE.CONTACT_MGR) {
          return users.filter((item) =>
            [
              ROLE_TYPE.CONTACT_MGR.toString(),
              ROLE_TYPE.CONTACT_EMP.toString(),
            ].includes(item.role),
          );
        } else if (role === ROLE_TYPE.CONTACT_EMP) {
          return users.filter((item) =>
            [ROLE_TYPE.CONTACT_EMP.toString()].includes(item.role),
          );
        }
        return [];
      }),
    );
  }

  getContacList() {
    this.listContact$ = this.contactService
      .getListContact()
      .pipe(map((res) => res));
  }
}
