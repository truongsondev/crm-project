import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { SalesOrderResponse } from '@app/interfaces/response.interface';
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
}
