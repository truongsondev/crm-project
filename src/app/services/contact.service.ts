import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { User } from '@app/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}
  private readonly endpoints = getEndpoints().contact.v1;
  getListContact(config: any) {
    let params = new HttpParams();

    for (const key in config) {
      if (config[key] !== undefined && config[key] !== null) {
        params = params.set(key, config[key]);
      }
    }
    return this.http.get<any[]>(`${this.endpoints.contacts}`, {
      params,
    });
  }

  createContact(data: any) {
    return this.http.post(this.endpoints.contacts, data, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer token',
      },
    });
  }

  updateContact(id: string, data: User) {
    const url = `${this.endpoints.contacts.replace(':id', id)}`;
    console.log(url);
    return this.http.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer token',
      },
    });
  }
}
