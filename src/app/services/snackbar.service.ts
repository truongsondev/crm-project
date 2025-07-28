// src/app/services/snackbar.service.ts

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PizzaPartyAnnotatedComponent } from '@app/shares/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private durationInSeconds = 2;

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
      duration: this.durationInSeconds * 1000,
      data: message,
    });
  }
}
