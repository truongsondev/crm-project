import { Component, ChangeDetectionStrategy } from '@angular/core';
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

  displayRole = {
    USER_ADMIN: 'Admin',
    DIR: 'Director',
    SALES_MGR: 'Sales Manager',
    SALES_EMP: 'Sales Person',
    CONTACT_MGR: 'Contact Manager',
    CONTACT_EMP: 'Contact Employee',
    USER_READ_ONLY: 'Guest',
  };
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<FilterComponent>,
  ) {}
  employees: User[] = [];
  selectedRole = '';

  onSubmit() {
    this.userService.getListUser('').subscribe((res) => {
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
    this.userService.getListUser('').subscribe((users) => {
      this.dialogRef.close({
        employees: users,
      });
    });
  }

  getUserByRole(role: Event) {
    const value = (role.target as HTMLSelectElement).value;
    this.selectedRole = value;
  }
}
