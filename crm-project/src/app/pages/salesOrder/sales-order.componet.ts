import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { ACTION, ITEM_OF_PAGE } from '@app/constants/shared.constant';
import { HeaderColumn } from '@app/custom-types/shared.type';
import { OPENDED_FROM_ENUM } from '@app/enums/shared.enum';
import { SalesOrderForm } from '@app/pages/salesOrder/components/salesorder-form/sales-order.component';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { FileService } from '@app/services/file.service';
import { ModalService } from '@app/services/modal.service';
import { SalesOrderService } from '@app/services/sales-order.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ButtonComponent } from '@app/shared-components/button/button.component';
import { ConfirmActionComponent } from '@app/shared-components/confirm-action/confirm-action.component';
import { ModalDiaLogComponent } from '@app/shared-components/modal/modal.component';
import { SearchComponent } from '@app/shared-components/search/search.component';
import { SelectOptionComponent } from '@app/shared-components/select-option/select-option.component';
import { SalesOrderFilterComponent } from './components/sales-order-filter/sales-order.component';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  standalone: true,
  selector: 'sale-order-component',
  templateUrl: './sales-order.component.html',
  imports: [
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    SearchComponent,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    ButtonComponent,
    MatCheckboxModule,
    TranslatePipe,
  ],
})
export class SaleOrderComponet {
  salesOrderList: SalesOrder[] = [];
  pageSize: number = ITEM_OF_PAGE;
  dataSource = new MatTableDataSource<SalesOrder>();
  lengthDatasource: number = 0;
  allSelected: Boolean = false;
  salesOrdersToDelete: string[] = [];
  pageIndex = 0;
  Math = Math;

  mySearch: string = 'No order/subject';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnDefs: HeaderColumn[] = [
    { column: 'all', label: 'All' },
    { column: 'order_number', label: 'No Order' },
    { column: 'subject', label: 'Subject' },
    { column: 'contact_id', label: 'Contact name' },
    { column: 'status', label: 'Status' },
    { column: 'total', label: 'Total' },
    { column: 'assigned_to', label: 'Assigned to' },
    { column: 'purchase_on', label: 'Purchase' },
    { column: 'updated_on', label: 'Updated on' },
    { column: 'action', label: 'Action' },
  ];
  displayedColumns: string[] = [
    'all',
    'order_number',
    'subject',
    'contact_id',
    'status',
    'total',
    'assigned_to',
    'purchase_on',
    'updated_on',
    'action',
  ];
  constructor(
    private salesOrderService: SalesOrderService,
    private modalService: ModalService,
    private fileService: FileService,
    private snackbarservice: SnackbarService,
    private router: ActivatedRoute,
  ) {}
  ngOnInit() {
    const queryParam = this.router.snapshot.queryParamMap.get('status');
    if (queryParam) {
      const queryParamSubject: BehaviorSubject<{ status: string }> =
        new BehaviorSubject<{ status: string }>({
          status: queryParam,
        });
      this.getSalesOrderList(queryParamSubject);
    } else {
      this.getSalesOrderList();
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSalesOrderList(filterVal?: Observable<any>) {
    const salesOrders$ = this.salesOrderService.getListSalesOrder();
    let result$: Observable<SalesOrder[]> = salesOrders$;

    if (filterVal) {
      result$ = filterVal.pipe(
        combineLatestWith(salesOrders$),
        map(
          ([
            {
              assignedTo,
              status,
              createdDateFrom,
              createdDateTo,
              updatedDateFrom,
              updatedDateTo,
            },
            salesOrdersData,
          ]) => {
            const sourceData = salesOrdersData.filter(
              (salesOrder: SalesOrder) => {
                return (
                  (assignedTo ? salesOrder.assigned_to === assignedTo : true) &&
                  (status ? salesOrder.status === status : true) &&
                  (createdDateFrom
                    ? new Date(salesOrder.created_on) >= createdDateFrom
                    : true) &&
                  (createdDateTo
                    ? new Date(salesOrder.created_on) <= createdDateTo
                    : true) &&
                  (updatedDateFrom
                    ? new Date(salesOrder.updated_on) >= updatedDateFrom
                    : true) &&
                  (updatedDateTo
                    ? new Date(salesOrder.updated_on) <= updatedDateTo
                    : true)
                );
              },
            );

            return sourceData;
          },
        ),
      );
    }

    result$.subscribe((data: SalesOrder[]) => {
      if (data) {
        const salesOrders = data;

        this.salesOrderList = salesOrders;
        this.dataSource.data = salesOrders;
        this.lengthDatasource = this.salesOrderList.length;
      }
    });
  }

  onSearch(searchKeyword: string) {
    this.salesOrderService.getListSalesOrder().subscribe({
      next: (data) => {
        const salesOrder = data;
        if (searchKeyword !== '') {
          this.salesOrderList = salesOrder.filter(
            (u: SalesOrder) =>
              u.subject?.includes(searchKeyword.trim()) ||
              u.order_number.includes(searchKeyword.trim()),
          );
        } else {
          this.salesOrderList = salesOrder;
        }
        this.dataSource.data = this.salesOrderList;
      },
      error: (err) => {
        this.snackbarservice.openSnackBar('Search failed: ' + err.message);
      },
    });
  }

  openDialog() {
    this.modalService
      .openModal(ModalDiaLogComponent, SelectOptionComponent, 'Select option', {
        action: ACTION.SELECT,
        selectedRow: null,
        dataList: this.salesOrderList,
        message: '',
        from: OPENDED_FROM_ENUM.SALE_ORDER,
      })
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getSalesOrderList();
        }
      });
  }
  deleteSelectedContacts() {
    if (this.salesOrdersToDelete.length > 0) {
      this.salesOrderService
        .deleteSalesOrder(this.salesOrdersToDelete)
        .subscribe(() => {
          this.snackbarservice.openSnackBar('Delete success');
          this.getSalesOrderList();
          this.allSelected = false;
        });
    } else {
      this.snackbarservice.openSnackBar('You not select sales order');
    }
  }

  openFilter() {
    this.modalService
      .openModal(ModalDiaLogComponent, SalesOrderFilterComponent, 'Filter by', {
        action: ACTION.NONE,
        selectedRow: null,
        dataList: [],
        message: '',
        from: OPENDED_FROM_ENUM.SALE_ORDER,
      })
      .subscribe((res) => {
        this.getSalesOrderList(res.filterSubject);
      });
  }

  exportToFileCSV() {
    const endpoint = getEndpoints().salesOrder.v1.downloadSalesOrders;
    this.fileService.downloadFile(endpoint).subscribe((res) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales-order.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onRowClick(row: SalesOrder) {
    this.modalService
      .openModal(ModalDiaLogComponent, SalesOrderForm, 'Edit Sale Order', {
        action: ACTION.UPDATE,
        selectedRow: row,
        dataList: this.salesOrderList,
        message: '',
        from: OPENDED_FROM_ENUM.SALE_ORDER,
      })
      .subscribe((res) => {
        if (res.isSubmit === true) {
          this.getSalesOrderList();
        }
      });
  }

  onDelete(row: SalesOrder) {
    this.modalService
      .openModal(
        ModalDiaLogComponent,
        ConfirmActionComponent,
        'Delete Sales Order',
        {
          action: ACTION.NONE,
          selectedRow: row,
          dataList: this.salesOrderList,
          message: '',
          from: OPENDED_FROM_ENUM.SALE_ORDER,
        },
      )
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getSalesOrderList();
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  selectAllSalesOrders(checked: boolean) {
    this.allSelected = checked;
    this.salesOrderList.forEach(
      (SalesOrder) => (SalesOrder.isChecked = checked),
    );
    this.salesOrdersToDelete = checked
      ? this.salesOrderList.map((SalesOrder) => SalesOrder._id)
      : [];
  }

  toggleSalesOrder(SalesOrder: SalesOrder) {
    SalesOrder.isChecked = !SalesOrder.isChecked;
    this.salesOrdersToDelete = this.salesOrderList
      .filter((SalesOrder) => SalesOrder.isChecked)
      .map((SalesOrder) => SalesOrder._id);

    this.allSelected = this.salesOrderList.every(
      (SalesOrder) => SalesOrder.isChecked,
    );
  }

  isIndeterminate(): boolean {
    const selected = this.salesOrderList.filter(
      (SalesOrder) => SalesOrder.isChecked,
    ).length;
    return selected > 0 && selected < this.salesOrderList.length;
  }
}
