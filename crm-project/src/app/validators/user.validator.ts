import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserValidator {
  constructor() {}

  static password(control: AbstractControl): ValidationErrors | null {
    const fieldVal = control.value;
    if (!fieldVal) {
      return null;
    } else {
      const hasUpperCase = /[A-Z]/.test(fieldVal);
      const hasLowerCase = /[a-z]/.test(fieldVal);
      const hasNumber = /[0-9]/.test(fieldVal);
      const hasSpecialChar = /[!@#$%^&*]/.test(fieldVal);
      const isValid =
        hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return isValid ? null : { password: true };
    }
  }

  static mustMatch(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isMatching =
        control.parent &&
        control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value;

      return isMatching ? null : { matching: true };
    };
  }

  static mustBeAfter(compareTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !control.parent) return null;

      const compareControl = control.parent.get(compareTo);
      if (!compareControl) return null;

      const currentDate = new Date(control.value);
      const compareDate = new Date(compareControl.value);

      return currentDate > compareDate ? null : { mustBeAfter: true };
    };
  }
}
