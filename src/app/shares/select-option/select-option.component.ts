import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ContactForm } from '@app/form/contacts/contact.form';
import { UserForm } from '@app/form/user/user.form';
import { ContactService } from '@app/services/contact.service';
import { ModalService } from '@app/services/modal.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { UserService } from '@app/services/user.service';
import { ModalDiaLogComponent } from '../modal/modal.component';

@Component({
  selector: 'select-component',
  templateUrl: './select-option.component.html',
  standalone: true,
})
export class SelectOptioncomponent {
  constructor(
    private modalService: ModalService,
    @Inject('data') public item: any,
    private dialogRef: MatDialogRef<SelectOptioncomponent>,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private contactService: ContactService,
  ) {}
  addSingleItem() {
    if (this.item.from === 'user-management') {
      this.modalService.openFilter(ModalDiaLogComponent, UserForm, 'Add user', {
        action: 'create',
        dataSelected: null,
        dataList: this.item.dataList,
        message: '',
        from: '',
      });
    } else if (this.item.from === 'contact') {
      this.modalService.openFilter(
        ModalDiaLogComponent,
        ContactForm,
        'Add contact',
        {
          action: 'create',
          dataSelected: null,
          dataList: this.item.dataList,
          message: '',
          from: 'contact',
        },
      );
    }

    this.dialogRef.close();
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
        if (this.item.from === 'user-management') {
          console.log('validData::::', validData);
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
        } else if (this.item.from === 'contact') {
          this.contactService.createContacts(validData).subscribe({
            next: (res) => {
              const failed = res.failed;
              this.downloadInvalidData(failed, 'conflicted_users.csv');
              this.snackbarService.openSnackBar('Create contact success');
            },
            error: () => {
              this.snackbarService.openSnackBar('Create contact fail!');
            },
          });
        }
        this.dialogRef.close();
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
      console.log('row:::', row);
      if (this.item.from === 'user-management') {
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
      } else if (this.item.from === 'contact') {
        isValid =
          row['contact_name']?.trim().length > 0 &&
          ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'].includes(
            row.salutation,
          ) &&
          /^\+?[0-9]{8,15}$/.test(row.phone || '') &&
          (!row.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) &&
          row.lead_source?.trim().length > 0 &&
          row.assigned_to?.trim().length > 0;
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
