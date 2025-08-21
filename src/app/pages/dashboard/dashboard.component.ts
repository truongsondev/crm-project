import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '@app/interfaces/contact.interface';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { CommonService } from '@app/services/common.service';
import { ContactService } from '@app/services/contact.service';
import { SalesOrderService } from '@app/services/sales-order.service';
import { SnackbarService } from '@app/services/snackbar.service';

import { ChartData, ChartOptions, ChartEvent, ActiveElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  standalone: true,
  selector: 'dashboard-component',
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponet {
  totalSalesOrders: number = 0;
  totalContacts: number = 0;
  totalIncome: number = 0;
  listSalesOrders: SalesOrder[] = [];
  listContacts: Contact[] = [];

  currentRole = '';
  data: { year: number; count: number }[] = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  salesStatusChartData: ChartData<'bar'> = {
    labels: this.data.map((row) => row.year),
    datasets: [
      {
        label: '',
        data: this.data.map((row) => row.count),
      },
    ],
  };

  contactSourceChartData: ChartData<'bar'> = {
    labels: this.data.map((row) => row.year),
    datasets: [
      {
        data: this.data.map((row) => row.count),
      },
    ],
  };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  constructor(
    private contactService: ContactService,
    private salesOrderService: SalesOrderService,
    private snackbarService: SnackbarService,
    private router: Router,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    this.getListContacts();
    this.getListSalesOrders();
    this.getRole();
  }

  getRole() {
    const user = this.commonService.parseToJson();
    this.currentRole = user?.role;
  }

  getListSalesOrders() {
    this.salesOrderService.getListSalesOrder().subscribe((res) => {
      const saleOrder = res?.salesOrder;
      if (!saleOrder) {
        this.snackbarService.openSnackBar('Not found sales order');
        return;
      }
      this.listSalesOrders = saleOrder;
      this.totalSalesOrders = this.listSalesOrders.length;
      this.totalIncome = this.listSalesOrders.reduce(
        (sum, so) => sum + (so.total || 0),
        0,
      );

      const grouped = this.groupBy(this.listSalesOrders, 'status');
      this.salesStatusChartData = {
        labels: Object.keys(grouped),
        datasets: [
          {
            data: Object.values(grouped).map((arr: any) => arr.length),
            backgroundColor: ['#6366f1', '#22c55e', '#f97316', '#ef4444'],
          },
        ],
      };
    });
  }

  getListContacts() {
    this.contactService.getListContact().subscribe((res) => {
      const contacts = res?.contacts;
      if (!contacts) {
        this.snackbarService.openSnackBar('Not found contacts');
        return;
      }
      this.listContacts = contacts;
      this.totalContacts = this.listContacts.length;

      const grouped = this.groupBy(this.listContacts, 'leadSource');
      this.contactSourceChartData = {
        labels: Object.keys(grouped),
        datasets: [
          {
            data: Object.values(grouped).map((arr: any) => arr.length),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
          },
        ],
      };
    });
  }

  private groupBy(arr: any[], key: string) {
    return arr.reduce(
      (acc, cur) => {
        const val = cur[key] || 'Unknown';
        if (!acc[val]) acc[val] = [];
        acc[val].push(cur);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  }

  onContactSourceClick(event: { event?: ChartEvent; active?: {}[] }) {
    const active = event.active as ActiveElement[];
    if (active?.length > 0) {
      const index = active[0].index;
      const label = this.contactSourceChartData.labels?.[index] ?? '';
      this.router.navigate(['/contacts'], {
        queryParams: { leadSource: label },
      });
    }
  }

  onSalesStatusClick(event: { event?: ChartEvent; active?: {}[] }) {
    const active = event.active as ActiveElement[];
    if (active?.length > 0) {
      const index = active[0].index;
      const label = this.salesStatusChartData.labels?.[index] ?? '';
      this.router.navigate(['/sales-orders'], {
        queryParams: { status: label },
      });
    }
  }
  isSalesRole() {
    return ['SALES_MGR', 'SALES_EMP'].includes(this.currentRole);
  }

  isContactRole() {
    return ['CONTACT_MGR', 'CONTACT_EMP'].includes(this.currentRole);
  }
}
