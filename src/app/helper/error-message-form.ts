import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe implements PipeTransform {
  private errorMessages: { [key: string]: string } = {
    required: 'This field is required',
    email: 'Invalid email format',
    passwordStrength: 'Password is too weak',
    passwordMismatch: 'Passwords do not match',
  };

  transform(control: AbstractControl | null): string | null {
    if (control && control.touched && control.errors) {
      const firstKey = Object.keys(control.errors)[0];
      return this.errorMessages[firstKey] || 'Invalid field';
    }
    return null;
  }
}
