import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormContact } from '@app/custom-types/shared.type';
import { ContactService } from '@app/services/contact.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ButtonComponent } from '../button/button.component';
@Component({
  selector: 'comfirm-component',
  templateUrl: 'confirm-action.component.html',
  standalone: true,
  imports: [ButtonComponent],
})
export class ConfirmActionComponent {
  contact_name: string = '';
  constructor(
    @Inject('data') public data: any,
    private dialogRef: MatDialogRef<ConfirmActionComponent>,
    private contactService: ContactService,
    private snackbarService: SnackbarService,
  ) {
    console.log(this.data.dataSelected);
    this.contact_name = this.data.dataSelected?.contact_name;
  }

  onDelete() {
    const _id = this.data.dataSelected?._id;
    this.contactService.deleteContact(_id).subscribe({
      next: () => {
        this.snackbarService.openSnackBar('Delete success!');
      },
      error: () => {
        this.snackbarService.openSnackBar('Delete fail!');
      },
    });
    this.dialogRef.close();
  }
  onCancel() {
    this.dialogRef.close();
  }
}
