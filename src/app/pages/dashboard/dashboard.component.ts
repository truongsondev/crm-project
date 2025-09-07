import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LEAD_SOURCE, STATUS_OPTION } from '@app/constants/shared.constant';
import { Contact } from '@app/interfaces/contact.interface';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { CommonService } from '@app/services/common.service';
import { ContactService } from '@app/services/contact.service';
import { SalesOrderService } from '@app/services/sales-order.service';
import { SnackbarService } from '@app/services/snackbar.service';

import { ChartData, ChartOptions, ChartEvent, ActiveElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  LeadSourceStatResponse,
  StatusStatResponse,
} from '@app/interfaces/response.interface';
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
  statusStat: StatusStatResponse[] = [];
  currentRole = '';

  salesStatusChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  contactSourceChartData: ChartData<'bar'> = { labels: [], datasets: [] };
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getRole();
    this.getListContacts();
    this.getListSalesOrders();
    this.getStatLeadSource();
    this.getStatStatus();
  }

  getStatLeadSource() {
    this.contactService.countContactByLeadSource().subscribe((res) => {
      const statsContacts = [...res];

      this.leadSourceStat = LEAD_SOURCE.map((source) => {
        const found = statsContacts.find(
          (contact) => contact.lead_source === source,
        );
        return found ? found : { count: 0, lead_source: source };
      });
      this.contactSourceChartData = {
        labels: this.leadSourceStat.map((contact) => contact.lead_source),
        datasets: [
          {
            label: 'contact',
            data: this.leadSourceStat.map((contact) => contact.count),
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
    });
  }

  getStatStatus() {
    this.salesOrderService.countSalesOrdersByLeadSource().subscribe((res) => {
      const statsSalesOrders = [...res];
      this.statusStat = STATUS_OPTION.map((source) => {
        const found = statsSalesOrders.find(
          (saleOrder) => saleOrder.status === source,
        );
        return found ? found : { count: 0, status: source };
      });
      this.salesStatusChartData = {
        labels: this.statusStat.map((saleOrder) => saleOrder.status),
        datasets: [
          {
            label: 'Sales Status',
            data: this.statusStat.map((saleOrder) => saleOrder.count),
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
    });
  }

  getRole() {
    const user = this.commonService.parseStringToJson('user');
    this.currentRole = user?.role;
  }

  getListSalesOrders() {
    this.salesOrderService.getListSalesOrder().subscribe((res) => {
      const saleOrder = res;
      if (!saleOrder) {
        this.snackbarService.openSnackBar('Not found sales order');
        return;
      }
      this.listSalesOrders = saleOrder.sort((a, b) => {
        return (
          new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
        );
      });
      this.totalSalesOrders = this.listSalesOrders.length;
      this.totalIncome = this.listSalesOrders.reduce(
        (sum, so) => sum + (so.total || 0),
        0,
      );

      //Change Detection không chạy lại sau khi dữ liệu async trả về.
      this.cdr.detectChanges();
    });
  }

  getListContacts() {
    this.contactService.getListContact().subscribe((res) => {
      const contacts = res;
      if (!contacts) {
        this.snackbarService.openSnackBar('Not found contacts');
        return;
      }
      this.listContacts = contacts.sort((a, b) => {
        return (
          new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
        );
      });
      this.totalContacts = this.listContacts.length;
      this.cdr.detectChanges();
    });
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
