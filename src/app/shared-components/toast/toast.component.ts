import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarLabel,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'snack-bar-annotated-component-example-snack',
  templateUrl: 'toast.component.html',
  imports: [MatButtonModule, MatSnackBarLabel],
})
export class PizzaPartyAnnotatedComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
