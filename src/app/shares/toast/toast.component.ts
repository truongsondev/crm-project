import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'snack-bar-annotated-component-example-snack',
  templateUrl: 'toast.component.html',
  styleUrl: 'toast.component.css',
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
})
export class PizzaPartyAnnotatedComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
  snackBarRef = inject(MatSnackBarRef);
}
