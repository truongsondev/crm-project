import { AbstractControl, ValidatorFn } from '@angular/forms';

export const terminatedAfterHiredValidator: ValidatorFn = (
  group: AbstractControl,
) => {
  const hired = group.get('hired_date')?.value;
  const terminated = group.get('terminated_date')?.value;

  if (!hired || !terminated) return null;
  return new Date(terminated) > new Date(hired)
    ? null
    : { terminatedBeforeHired: true };
};
