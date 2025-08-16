import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { ACTION } from '@app/constants/shared.constant';
import { HeaderColumn } from '@app/custom-types/shared.type';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { ModalService } from '@app/services/modal.service';
import { SalesOrderService } from '@app/services/sales-order.service';
import { ButtonComponent } from '@app/shares/button/button.component';
import { ModalDiaLogComponent } from '@app/shares/modal/modal.component';
import { SearchComponent } from '@app/shares/search/search.component';
import { SelectOptioncomponent } from '@app/shares/select-option/select-option.component';

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
  ],
})
export class SaleOrderComponet {
  pageSize: number = 0;
  salesOrder: SalesOrder[] = [];
  dataSource!: MatTableDataSource<SalesOrder>;
  lengthDatasource: number = 0;
  allSelected: Boolean = false;
  mySearch: string = 'salse name';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnDefs: HeaderColumn[] = [
    { column: 'all', label: 'All' },
    { column: 'order_number', label: 'No Order' },
    { column: 'subject', label: 'Subject' },
    { column: 'contact_id', label: 'Contact name' },
    { column: 'status', label: 'Stauts' },
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
  ) {}
  ngOnInit() {
    this.getListSalesOrder();
  }

  getListSalesOrder() {
    this.salesOrderService.getListSalesOrder().subscribe({
      next: (res) => {
        const { salesOrder } = res;
        this.salesOrder = salesOrder;
        this.dataSource = new MatTableDataSource(salesOrder);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.lengthDatasource = this.dataSource?.data?.length ?? 0;
      },
    });
  }

  onSearch(searchKeyword: string) {}

  openDialog() {
    this.modalService.openModal(
      ModalDiaLogComponent,
      SelectOptioncomponent,
      'Select option',
      {
        action: ACTION.SELECT,
        dataSelected: null,
        dataList: this.salesOrder,
        message: '',
        from: 'salse-order',
      },
    );
  }
  deleteMany() {}

  openFilter() {}

  exportToFileCSV() {}

  onRowClick(row: SalesOrder) {}

  onDelete(row: SalesOrder) {}

  insertListDelete(row: SalesOrder) {}

  onPageChange(event: PageEvent) {}

  selectAllSalesOrder() {}
}
