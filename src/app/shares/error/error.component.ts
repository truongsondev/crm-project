import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Error } from '@app/custom-types/shared.type';
@Component({
  selector: 'error-component',
  templateUrl: 'error.component.html',
  standalone: true,
})
export class ErrorComponent {
  message!: string;

  constructor(
    @Inject('data') public data: Error,
    private dialogRef: MatDialogRef<ErrorComponent>,
  ) {}

  ngOnInit() {
    this.message = this.data.message;
  }

  onclose() {
    this.dialogRef.close();
  }
}
