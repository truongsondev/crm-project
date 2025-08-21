import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '@app/interfaces/user.interface';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import {
  LEAD_SOURCE,
  ROLES,
  STATUSOPTION,
} from '@app/constants/shared.constant';
import { From } from '@app/custom-types/shared.type';
import { ButtonComponent } from '@app/shared-components/button/button.component';
import { SalesOrderService } from '@app/services/sales-order.service';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { combineLatest, map, Observable, startWith, take } from 'rxjs';

@Component({
  selector: 'filter-component',
  templateUrl: './sales-order.filter.html',
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
export class SalesOrderFilterComponent {
  assignedTo: string[] = [];
  salesOrders$!: Observable<SalesOrder[]>;
  filteredSalesOrders$!: Observable<SalesOrder[]>;
  filterFormSalesOrder = new FormGroup({
    status: new FormControl<string>(''),
    assignedTo: new FormControl<string>(''),
    createStartDate: new FormControl<Date | null>(null),
    createEndDate: new FormControl<Date | null>(null),
    updateStartDate: new FormControl<Date | null>(null),
    updateEndDate: new FormControl<Date | null>(null),
  });
  displayStatus = STATUSOPTION;
  protected readonly value = signal('');

  protected onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.value.set(value);
  }
  constructor(
    private dialogRef: MatDialogRef<SalesOrderFilterComponent>,
    @Inject('data') public fromData: From,
    private salesOrderService: SalesOrderService,
  ) {}

  ngOnInit(): void {
    this.salesOrders$ = this.salesOrderService
      .getListSalesOrder()
      .pipe(map((res) => res.salesOrder));

    this.salesOrders$.subscribe((res) => {
      const names = res.map((item) => item.assigned_to.name);
      this.assignedTo = [...new Set(names)];
    });
  }

  combineValue() {
    this.salesOrders$ = combineLatest([
      this.salesOrders$,
      this.filterFormSalesOrder.valueChanges.pipe(
        startWith(this.filterFormSalesOrder.value),
      ),
    ]).pipe(map(([users, filter]) => this.applyFilter(users, filter)));
  }

  private applyFilter(users: SalesOrder[], filter: any): SalesOrder[] {
    return users.filter((item) => {
      let match = true;
      console.log(item);
      console.log('filter:::', filter);
      if (filter.status) {
        match = match && item.status === filter.status;
      }
      if (filter.assignedTo) {
        match = match && item.assigned_to.name === filter.assignedTo;
      }

      if (filter.createStartDate && filter.createEndDate) {
        const createdTime = new Date(item.created_on);
        match =
          match &&
          createdTime >= filter.createStartDate &&
          createdTime <= filter.createEndDate;
      }

      if (filter.updateStartDate && filter.updateEndDate) {
        const updatedTime = new Date(item.updated_on);
        match =
          match &&
          updatedTime >= filter.updateStartDate &&
          updatedTime <= filter.updateEndDate;
      }

      return match;
    });
  }

  onSubmit() {
    this.combineValue();
    this.salesOrders$.pipe(take(1)).subscribe((filtered) => {
      this.dialogRef.close({
        filters: this.filterFormSalesOrder.value,
        salesOrder: filtered,
      });
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
