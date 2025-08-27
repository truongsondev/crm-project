import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { From } from '@app/custom-types/shared.type';

import { ButtonComponent } from '@app/shared-components/button/button.component';
import { ROLES } from '@app/constants/shared.constant';
import { BehaviorSubject } from 'rxjs';

interface FilterCriteria {
  role?: string;
  createdDateFrom?: object;
  createdDateTo?: object;
  updatedDateFrom?: object;
  updatedDateTo?: object;
}

@Component({
  selector: 'filter-component',
  templateUrl: './user-filter.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    ButtonComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserFilterComponent {
  displayRole = ROLES;
  filterSubject: BehaviorSubject<FilterCriteria> =
    new BehaviorSubject<FilterCriteria>({});
  userFilterForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UserFilterComponent>,
    @Inject('data') public fromData: From,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.userFilterForm = new FormGroup({
      role: new FormControl<string>(''),
      createdStartDate: new FormControl<Date | null>(null),
      createdEndDate: new FormControl<Date | null>(null),
      updatedStartDate: new FormControl<Date | null>(null),
      updatedEndDate: new FormControl<Date | null>(null),
    });
    this.filterSubject.next({});
  }

  applyFilter() {
    this.setFilterSubject();
    this.dialogRef.close({
      filterSubject: this.filterSubject,
    });
  }

  setFilterSubject() {
    const currentFilterObj = this.filterSubject.getValue();
    this.filterSubject.next({
      ...currentFilterObj,
      ...this.userFilterForm.value,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
