import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { Contact } from '@app/interfaces/contact.interface';
import {
  ContactReponse,
  ContactsReponse,
} from '@app/interfaces/response.interface';
import { User } from '@app/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}
  private readonly endpoints = getEndpoints().contact.v1;
  getListContact() {
    return this.http.get<ContactsReponse>(`${this.endpoints.contacts}`);
  }

  createContact(data: any) {
    return this.http.post<ContactReponse>(this.endpoints.contacts, data, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer token',
      },
    });
  }

  updateContact(id: string, data: Contact) {
    const url = `${this.endpoints.update_contact.replace(':id', id)}`;
    return this.http.put<ContactReponse>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer token',
      },
    });
  }
}
