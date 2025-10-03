import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import {
  FileImportResponse,
  StatusStatResponse,
} from '@app/interfaces/response.interface';
import { SalesOrder } from '@app/interfaces/sales-order.interface';
import { CommonService } from './common.service';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private readonly endpoints = getEndpoints().salesOrder.v1;

  constructor(
    private endpointService: EndpointService,
    private commonService: CommonService,
  ) {}
  getListSalesOrder() {
    const endpoint = this.endpoints.salesOrder;
    return this.commonService.withAuth<SalesOrder[]>(endpoint, (url, options) =>
      this.endpointService.fetchEndpoint<SalesOrder[]>(url, options),
    );
  }

  createSaleOrder(data: any) {
    const endpoint = this.endpoints.createSalesOrder;
    return this.commonService.withAuth<SalesOrder>(endpoint, (url, options) =>
      this.endpointService.postEndpoint<SalesOrder>(url, data, options),
    );
  }

  createSalesOrder(data: any) {
    const endpoint = this.endpoints.createSalesOrders;
    return this.commonService.withAuth<FileImportResponse>(
      endpoint,
      (url, options) =>
        this.endpointService.postEndpoint<FileImportResponse>(
          url,
          data,
          options,
        ),
    );
  }

  updateSalesOrder(id: string, data: any) {
    const endpoint = `${this.endpoints.updateSaleOrder}/${id}`;
    return this.commonService.withAuth<SalesOrder>(endpoint, (url, options) =>
      this.endpointService.putEndpoint<SalesOrder>(url, data, options),
    );
  }

  deleteSaleOrder(id: string) {
    const endpoint = `${this.endpoints.deleteSalesOrders}/${id}`;
    return this.commonService.withAuth<void>(endpoint, (url, options) =>
      this.endpointService.deleteEndpoint<void>(url, options),
    );
  }

  deleteSalesOrder(ids: string[]) {
    const endpoint = this.endpoints.deleteSalesOrders;
    return this.commonService.withAuth<void>(endpoint, (url, options) =>
      this.endpointService.postEndpoint<void>(url, ids, options),
    );
  }

  countSalesOrdersByLeadSource() {
    const endpoint = this.endpoints.chartSalesOrders;
    return this.commonService.withAuth<StatusStatResponse[]>(
      endpoint,
      (url, options) =>
        this.endpointService.fetchEndpoint<StatusStatResponse[]>(url, options),
    );
  }
}
