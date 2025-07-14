import { Component, Inject, Type } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  selector: 'app-modal-dialog',
  templateUrl: './modal.component.html',
})
export class ModalDiaLogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { component: Type<unknown>, title: string },
  ) {}
}
