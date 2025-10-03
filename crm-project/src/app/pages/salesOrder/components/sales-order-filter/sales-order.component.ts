import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { STATUS_OPTION } from '@app/constants/shared.constant';
import { ModalOrigin } from '@app/custom-types/shared.type';
import { ButtonComponent } from '@app/shared-components/button/button.component';

import { BehaviorSubject } from 'rxjs';
import { ContactService } from '@app/services/contact.service';

interface FilterCriteria {
  assignedTo?: string;
  status?: string;
  createdDateFrom?: object;
  createdDateTo?: object;
  updatedDateFrom?: object;
  updatedDateTo?: object;
}

@Component({
  selector: 'filter-component',
  templateUrl: './sales-order.component.html',
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
export class SalesOrderFilterComponent {
  filterSubject: BehaviorSubject<FilterCriteria> =
    new BehaviorSubject<FilterCriteria>({});
  salesOrderFilterForm!: FormGroup;
  assignedTo: string[] = [];
  displayStatus = STATUS_OPTION;

  constructor(
    private dialogRef: MatDialogRef<SalesOrderFilterComponent>,
    private contactService: ContactService,
    @Inject('data') public fromData: ModalOrigin,
  ) {}

  initForm() {
    this.salesOrderFilterForm = new FormGroup({
      status: new FormControl<string>(''),
      assignedTo: new FormControl<string>(''),
      createStartDate: new FormControl<Date | null>(null),
      createEndDate: new FormControl<Date | null>(null),
      updateStartDate: new FormControl<Date | null>(null),
      updateEndDate: new FormControl<Date | null>(null),
    });
    this.filterSubject.next({});
  }

  ngOnInit(): void {
    this.initForm();
    this.getListAssignedTo();
  }

  getListAssignedTo() {
    this.contactService.getListContact().subscribe((res) => {
      const names = res.map((item) => item.assigned_to.name);
      this.assignedTo = [...new Set(names)];
    });
  }

  setFilterSubject() {
    const currentFilterObj = this.filterSubject.getValue();
    this.filterSubject.next({
      ...currentFilterObj,
      ...this.salesOrderFilterForm.value,
    });
  }

  applyFilter() {
    this.setFilterSubject();
    this.dialogRef.close({
      filterSubject: this.filterSubject,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
