import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OPENDED_FROM_ENUM } from '@app/enums/shared.enum';
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
    this.nameDeleted =
      this.data.from === OPENDED_FROM_ENUM.CONTACT
        ? this.data.dataSelected?.contact_name
        : this.data.dataSelected.order_number;
  }

  onDelete() {
    const _id = this.data.dataSelected?._id;
    if (this.data.from === OPENDED_FROM_ENUM.CONTACT) {
      this.contactService.deleteContact(_id).subscribe({
        next: () => {
          this.snackbarService.openSnackBar('Delete success!');
        },
        error: () => {
          this.snackbarService.openSnackBar('Delete fail!');
        },
      });
    } else if (this.data.from === OPENDED_FROM_ENUM.SALE_ORDER) {
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
