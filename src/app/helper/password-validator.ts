import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;
  if (!value) return { required: true };

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*]/.test(value);

  const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  return valid
    ? null
    : {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecialChar,
        },
      };
}

export function confirmPasswordValidator(
  group: AbstractControl,
): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirm_password')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
