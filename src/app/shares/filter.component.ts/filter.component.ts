import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '@app/interfaces/user.interface';
import { UserService } from '@app/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ROLES } from '@app/constants/shared.constant';

@Component({
  selector: 'filter-component',
  templateUrl: './filter.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,

  standalone: true,
})
export class FilterComponent {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  readonly updateTime = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  displayRole = ROLES;
  protected readonly value = signal('');

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<FilterComponent>,
  ) {}
  employees: User[] = [];
  selectedRole = '';

  onSubmit() {
    this.userService.getListUser().subscribe((res) => {
      const { users } = res;
      const filtered = users.filter((user) => {
        let match = true;
        if (this.selectedRole) {
          match = match && user.role === this.selectedRole;
        }
        const createdStart = this.range.get('start')?.value;
        const createdEnd = this.range.get('end')?.value;
        if (createdStart && createdEnd) {
          const createdTime = new Date(user.created_time);
          match =
            match && createdTime >= createdStart && createdTime <= createdEnd;
        }
        const updatedStart = this.updateTime.get('start')?.value;
        const updatedEnd = this.updateTime.get('end')?.value;
        if (updatedStart && updatedEnd) {
          const updatedTime = new Date(user.updated_time);
          match =
            match && updatedTime >= updatedStart && updatedTime <= updatedEnd;
        }
        return match;
      });
      this.dialogRef.close({
        role: this.selectedRole,
        createdRange: this.range.value,
        updatedRange: this.updateTime.value,
        employees: filtered,
      });
    });
  }

  onCancel() {
    this.userService.getListUser().subscribe((users) => {
      this.dialogRef.close({
        employees: users,
      });
    });

    this.userService.getListUser();
  }

  getUserByRole(role: string) {
    this.selectedRole = role;
  }
}
