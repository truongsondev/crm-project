import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { Contact } from '@app/interfaces/contact.interface';
import {
  ContactReponse,
  ContactsReponse,
} from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private endpointService: EndpointService) {}
  private readonly endpoints = getEndpoints().contact.v1;
  getListContact() {
    const endpoint = this.endpoints.contacts;
    return this.endpointService.fetchEndpoint<ContactsReponse>(endpoint);
  }

  createContact(data: any) {
    const endpoint = this.endpoints.contacts;

    return this.endpointService.postEndpoint<ContactReponse>(endpoint, data);
  }

  updateContact(id: string, data: Contact) {
    const url = `${this.endpoints.update_contact.replace(':id', id)}`;
    return this.endpointService.putEndpoint<ContactReponse>(url, data);
  }

  deleteContact(id: string) {
    const url = `${this.endpoints.delete_contact.replace(':id', id)}`;
    return this.endpointService.deleteEndpoint<ContactReponse>(url);
  }
}
