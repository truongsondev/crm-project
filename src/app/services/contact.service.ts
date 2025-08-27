import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { Contact } from '@app/interfaces/contact.interface';
import {
  DataResponse,
  LeadSourceStatResponse,
} from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private endpointService: EndpointService) {}
  private readonly endpoints = getEndpoints().contact.v1;
  getListContact() {
    const endpoint = this.endpoints.contacts;
    return this.endpointService.fetchEndpoint<Contact[]>(endpoint);
  }

  createContact(data: any) {
    const endpoint = this.endpoints.contacts;

    return this.endpointService.postEndpoint(endpoint, data);
  }

  createContacts(data: any) {
    const endpoint = this.endpoints.create_contacts;

    return this.endpointService.postEndpoint<DataResponse>(endpoint, data);
  }

  updateContact(id: string, data: Contact) {
    const endpoint = `${this.endpoints.update_contact.replace(':id', id)}`;
    return this.endpointService.putEndpoint(endpoint, data);
  }

  deleteContact(id: string) {
    const endpoint = `${this.endpoints.delete_contact.replace(':id', id)}`;
    return this.endpointService.deleteEndpoint(endpoint);
  }
  deleteContacts(id: string[]) {
    const endpoint = this.endpoints.delete_contacts;
    return this.endpointService.postEndpoint(endpoint, id);
  }

  countContactByLeadSource() {
    const endpoint = this.endpoints.chart_contacts;
    return this.endpointService.fetchEndpoint<LeadSourceStatResponse[]>(
      endpoint,
    );
  }
}
