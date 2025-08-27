import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LEAD_SOURCE } from '@app/constants/shared.constant';
import { Contact } from '@app/interfaces/contact.interface';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { CommonService } from '@app/services/common.service';
import { ContactService } from '@app/services/contact.service';
import { SalesOrderService } from '@app/services/sales-order.service';
import { SnackbarService } from '@app/services/snackbar.service';

import { ChartData, ChartOptions, ChartEvent, ActiveElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LeadSourceStatResponse } from '@app/interfaces/response.interface';
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
  leadSourceStat: LeadSourceStatResponse[] = [];

  currentRole = '';

  salesStatusChartData: ChartData<'bar'> = {
    labels: this.leadSourceStat.map((item) => item.lead_source),
    datasets: [
      {
        label: '',
        data: this.leadSourceStat.map((item) => item.count),
      },
    ],
  };

  contactSourceChartData: ChartData<'bar'> = {
    labels: this.leadSourceStat.map((item) => item.lead_source),
    datasets: [
      {
        data: this.leadSourceStat.map((item) => item.count),
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
    this.getRole();
  }

  ngAfterViewInit() {
    this.getListContacts();
    this.getListSalesOrders();
    this.getStatLeadSource();
  }

  setDataForContactSource() {
    return {
      labels: this.leadSourceStat.map((item) => item.lead_source),
      datasets: [
        {
          data: this.leadSourceStat.map((item) => item.count),
        },
      ],
    };
  }

  getStatLeadSource() {
    this.contactService.countContactByLeadSource().subscribe((res) => {
      console.log(res);
      const stats = [...res];

      this.leadSourceStat = LEAD_SOURCE.map((source) => {
        const found = stats.find((x) => x.lead_source === source);
        return found ? found : { lead_source: source, count: 0 };
      });
      this.contactSourceChartData = {
        labels: this.leadSourceStat.map((item) => item.lead_source),
        datasets: [
          {
            data: this.leadSourceStat.map((item) => item.count),
            backgroundColor: [
              '#10b981',
              '#3b82f6',
              '#f59e0b',
              '#ec4899',
              '#8b5cf6',
              '#ef4444',
            ],
          },
        ],
      };
      console.log(this.leadSourceStat);
    });
  }

  getRole() {
    const user = this.commonService.parseToJson();
    this.currentRole = user?.role;
  }

  getListSalesOrders() {
    this.salesOrderService.getListSalesOrder().subscribe((res) => {
      const saleOrder = res;
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
      const contacts = res;
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
