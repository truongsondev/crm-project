import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openFilter(
    ModalDialogComponent: any,
    innerComponent: any,
    title: string,
    options: {
      action: string;
      dataSelected: any | null;
      dataList: any[];
      message: string;
      from: string;
    },
  ) {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      data: {
        component: innerComponent,
        title: title,
        data: options,
      },
    });

    return dialogRef.afterClosed();
  }
}
