import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactForm } from '@app/pages/contact/components/contact-form/contact.component';
import { SalesOrderForm } from '@app/pages/salesOrder/components/salesorder-form/sales-order.component';
import { UserForm } from '@app/pages/user/components/user-form/user.component';
import { ContactService } from '@app/services/contact.service';
import { ModalService } from '@app/services/modal.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { UserService } from '@app/services/user.service';
import { ButtonComponent } from '../button/button.component';
import { ModalDiaLogComponent } from '../modal/modal.component';
import { ACTION } from '@app/constants/shared.constant';
import { SalesOrderService } from '@app/services/sales-order.service';
import { OPENDED_FROM_ENUM } from '@app/enums/shared.enum';
@Component({
  selector: 'select-component',
  templateUrl: './select-option.component.html',
  standalone: true,
  imports: [ButtonComponent],
})
export class SelectOptionComponent {
  constructor(
    private modalService: ModalService,
    @Inject('data') public item: any,
    private dialogRef: MatDialogRef<SelectOptionComponent>,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private contactService: ContactService,
    private saleOrderService: SalesOrderService,
  ) {}
  addSingleItem() {
    if (this.item.from === OPENDED_FROM_ENUM.USER_MANAGEMENT) {
      this.modalService
        .openModal(ModalDiaLogComponent, UserForm, 'Add user', {
          action: ACTION.CREATE,
          selectedRow: null,
          dataList: this.item.dataList,
          message: '',
          from: OPENDED_FROM_ENUM.USER_MANAGEMENT,
        })
        .subscribe(() => {
          this.dialogRef.close({
            isSubmit: true,
          });
        });
    } else if (this.item.from === OPENDED_FROM_ENUM.CONTACT) {
      this.modalService
        .openModal(ModalDiaLogComponent, ContactForm, 'Add contact', {
          action: ACTION.CREATE,
          selectedRow: null,
          dataList: this.item.dataList,
          message: '',
          from: OPENDED_FROM_ENUM.CONTACT,
        })
        .subscribe(() => {
          this.dialogRef.close({
            isSubmit: true,
          });
        });
    } else if (this.item.from === OPENDED_FROM_ENUM.SALE_ORDER) {
      this.modalService
        .openModal(ModalDiaLogComponent, SalesOrderForm, 'Add sale order', {
          action: ACTION.CREATE,
          selectedRow: null,
          dataList: this.item.dataList,
          message: '',
          from: OPENDED_FROM_ENUM.SALE_ORDER,
        })
        .subscribe(() => {
          this.dialogRef.close({
            isSubmit: true,
          });
        });
    }
  }

  private downloadInvalidData(
    invalidData: any[],
    fileName = 'invalid_data.csv',
  ): void {
    if (!invalidData.length) return;

    const keys = Object.keys(invalidData[0]);
    const csvContent =
      keys.join(',') +
      '\n' +
      invalidData
        .map((row) =>
          keys
            .map((k) => `"${(row[k] ?? '').toString().replace(/"/g, '""')}"`)
            .join(','),
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      const csv = reader.result as string;
      const data = this.csvToJson(csv);
      const { validData, invalidData } = this.validateCSV(data);

      if (invalidData.length > 0) {
        this.snackbarService.openSnackBar(
          `There are ${invalidData.length} invalid entries. Please check again.`,
        );
        this.downloadInvalidData(invalidData, 'record failed');
      }

      if (validData.length > 0) {
        if (this.item.from === OPENDED_FROM_ENUM.USER_MANAGEMENT) {
          this.userService.createUsers(validData).subscribe({
            next: (res) => {
              const failed = res.failed;
              this.downloadInvalidData(failed, 'conflicted_users.csv');
              this.snackbarService.openSnackBar('Create users success');
            },
            error: () => {
              this.snackbarService.openSnackBar('Create users fail!');
            },
          });
        } else if (this.item.from === OPENDED_FROM_ENUM.CONTACT) {
          this.contactService.createContacts(validData).subscribe({
            next: (res) => {
              const failed = res.failed;
              this.downloadInvalidData(failed, 'conflicted_contact.csv');
              this.snackbarService.openSnackBar('Create contact success');
            },
            error: () => {
              this.snackbarService.openSnackBar('Create contact fail!');
            },
          });
        } else if (this.item.from === OPENDED_FROM_ENUM.SALE_ORDER) {
          this.saleOrderService.createSalesOrder(data).subscribe({
            next: (res) => {
              const failed = res.failed;
              this.downloadInvalidData(failed, 'conflicted_sales.csv');
              this.snackbarService.openSnackBar('Create sales order success');
            },
            error: () => {
              this.snackbarService.openSnackBar('Create sales order fail!');
            },
          });
        }
        this.dialogRef.close({
          isSubmit: true,
        });
      }
    };
  }

  csvToJson(csv: string): any[] {
    const lines = csv.split('\n').filter((line) => line.trim() !== '');
    const key = lines[0].split(',').map((h) => h.trim());

    const rows = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const obj: Record<string, string> = {};
      key.forEach((header, i) => {
        obj[header] = values[i] ?? '';
      });
      return obj;
    });

    return rows;
  }
  validateCSV(data: any[]) {
    const validData: any[] = [];
    const invalidData: any[] = [];

    for (const row of data) {
      let isValid = false;
      if (this.item.from === OPENDED_FROM_ENUM.USER_MANAGEMENT) {
        isValid =
          row.first_name?.trim().length > 0 &&
          row.last_name?.trim().length > 0 &&
          row.username?.trim().length >= 3 &&
          row.password?.length >= 8 &&
          /[A-Z]/.test(row.password) &&
          /[a-z]/.test(row.password) &&
          /\d/.test(row.password) &&
          /[!@#$%^&*]/.test(row.password) &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email) &&
          row.role?.trim().length > 0;
      } else if (this.item.from === OPENDED_FROM_ENUM.CONTACT) {
        isValid =
          row['contact_name']?.trim().length > 0 &&
          ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'].includes(
            row.salutation,
          ) &&
          /^\+?[0-9]{8,15}$/.test(row.phone || '') &&
          (!row.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) &&
          row.lead_source?.trim().length > 0;
      } else {
        isValid = true;
      }
      if (isValid) {
        validData.push(row);
      } else {
        invalidData.push(row);
      }
    }

    return { validData, invalidData };
  }
}
