import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormContact } from '@app/custom-types/shared.type';
import { ContactService } from '@app/services/contact.service';
import { SalesOrderService } from '@app/services/sales-order.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ButtonComponent } from '../button/button.component';
@Component({
  selector: 'comfirm-component',
  templateUrl: 'confirm-action.component.html',
  standalone: true,
  imports: [ButtonComponent],
})
export class ConfirmActionComponent {
  nameDeleted: string = '';
  constructor(
    @Inject('data') public data: any,
    private dialogRef: MatDialogRef<ConfirmActionComponent>,
    private contactService: ContactService,
    private snackbarService: SnackbarService,
    private salesOrderService: SalesOrderService,
  ) {
    console.log(this.data.dataSelected);
    this.nameDeleted =
      this.data.from === 'contact'
        ? this.data.dataSelected?.contact_name
        : this.data.dataSelected.order_number;
  }

  onDelete() {
    const _id = this.data.dataSelected?._id;
    if (this.data.from === 'contact') {
      this.contactService.deleteContact(_id).subscribe({
        next: () => {
          this.snackbarService.openSnackBar('Delete success!');
        },
        error: () => {
          this.snackbarService.openSnackBar('Delete fail!');
        },
      });
    } else if (this.data.from === 'sales-order') {
      this.salesOrderService.deleteSaleOrder(_id).subscribe({
        next: () => {
          this.snackbarService.openSnackBar('Delete success!');
        },
        error: () => {
          this.snackbarService.openSnackBar('Delete fail!');
        },
      });
    }
    this.dialogRef.close({
      isSubmit: true,
    });
  }
  onCancel() {
    this.dialogRef.close({
      isSubmit: false,
    });
  }
}
