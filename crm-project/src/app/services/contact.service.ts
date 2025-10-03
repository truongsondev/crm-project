import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { Contact } from '@app/interfaces/contact.interface';
import {
  FileImportResponse,
  LeadSourceStatResponse,
} from '@app/interfaces/response.interface';
import { CommonService } from './common.service';
import { EndpointService } from './endpoint.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(
    private endpointService: EndpointService,
    private commonService: CommonService,
  ) {}
  private readonly endpoints = getEndpoints().contact.v1;

  getListContact() {
    const endpoint = this.endpoints.contacts;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.fetchEndpoint<Contact[]>(url, options),
    );
  }

  createContact(data: any) {
    const endpoint = this.endpoints.contacts;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.postEndpoint<Contact>(url, data, options),
    );
  }

  createContacts(data: any) {
    const endpoint = this.endpoints.createContacts;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.postEndpoint<FileImportResponse>(url, data, options),
    );
  }

  updateContact(id: string, data: Contact) {
    const endpoint = `${this.endpoints.updateContact}/${id}`;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.putEndpoint<Contact>(url, data, options),
    );
  }

  deleteContact(id: string) {
    const endpoint = `${this.endpoints.deleteContact}/${id}`;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.deleteEndpoint<void>(url, options),
    );
  }

  deleteContacts(ids: string[]) {
    const endpoint = this.endpoints.deleteContacts;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.postEndpoint<void>(endpoint, ids, options),
    );
  }

  countContactByLeadSource() {
    const endpoint = this.endpoints.chartContacts;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.fetchEndpoint<LeadSourceStatResponse[]>(
        url,
        options,
      ),
    );
  }
}
