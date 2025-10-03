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
import { LEAD_SOURCE } from '@app/constants/shared.constant';
import { ModalOrigin } from '@app/custom-types/shared.type';
import { ButtonComponent } from '@app/shared-components/button/button.component';

import { BehaviorSubject } from 'rxjs';

interface FilterCriteria {
  assignedTo?: string;
  leadSource?: string;
  createdDateFrom?: object;
  createdDateTo?: object;
  updatedDateFrom?: object;
  updatedDateTo?: object;
}

@Component({
  selector: 'filter-component',
  templateUrl: './contact.component.html',
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
    ButtonComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ContactFilterComponent {
  contactFilterForm!: FormGroup;
  filterSubject: BehaviorSubject<FilterCriteria> =
    new BehaviorSubject<FilterCriteria>({});
  leadSource: string[] = LEAD_SOURCE;
  assignedTo: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<ContactFilterComponent>,
    @Inject('data') public fromData: ModalOrigin,
  ) {}

  initForm() {
    this.contactFilterForm = new FormGroup({
      leadSource: new FormControl<String>(''),
      assignedTo: new FormControl<String>(''),
      createStartDate: new FormControl<Date | null>(null),
      createEndDate: new FormControl<Date | null>(null),
      updateStartDate: new FormControl<Date | null>(null),
      updateEndDate: new FormControl<Date | null>(null),
    });
    this.filterSubject.next({});
  }

  ngOnInit() {
    this.initForm();
  }

  applyFilter() {
    this.setFilterSubject();
    this.dialogRef.close({
      filterSubject: this.filterSubject,
    });
  }

  setFilterSubject() {
    const currentFilterSubject = this.filterSubject.getValue();
    this.filterSubject.next({
      ...currentFilterSubject,
      ...this.contactFilterForm.value,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
