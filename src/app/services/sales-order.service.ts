import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import {
  DataResponse,
  SaleOrderResponse,
  SalesOrderResponse,
} from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';
@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  constructor(private endpointService: EndpointService) {}
  getListSalesOrder() {
    const endpoint = getEndpoints().salesOrder.v1.salesOrder;
    return this.endpointService.fetchEndpoint<SalesOrderResponse>(endpoint);
  }

  createSaleOrder(data: any) {
    const endpoint = getEndpoints().salesOrder.v1.create_sale_order;
    return this.endpointService.postEndpoint<SalesOrderResponse>(
      endpoint,
      data,
    );
  }

  createSalesOrder(data: any) {
    const endpoint = getEndpoints().salesOrder.v1.create_sales_order;
    return this.endpointService.postEndpoint<DataResponse>(endpoint, data);
  }
  updateSalesOrder(id: string, data: any) {
    const endpoint = getEndpoints().salesOrder.v1.update_sale_order.replace(
      ':id',
      id,
    );
    return this.endpointService.putEndpoint<SaleOrderResponse>(endpoint, data);
  }

  deleteSaleOrder(id: string) {
    const endpoint = getEndpoints().salesOrder.v1.delete_sale_order.replace(
      ':id',
      id,
    );
    return this.endpointService.deleteEndpoint<SaleOrderResponse>(endpoint);
  }

  deleteSalesOrder(id: string[]) {
    const endpoint = getEndpoints().salesOrder.v1.delete_sales_order;
    return this.endpointService.postEndpoint<SaleOrderResponse>(endpoint, id);
  }
}
