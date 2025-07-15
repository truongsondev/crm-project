import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { User } from '@app/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  private readonly endpoints = getEndpoints().user.v1;
  getListUser(config: any) {
    let params = new HttpParams();

    for (const key in config) {
      if (config[key] !== undefined && config[key] !== null) {
        params = params.set(key, config[key]);
      }
    }
    return this.http.get<any[]>(`${this.endpoints.users}`, {
      params,
    });
  }

  createUser(data: any) {
    return this.http
      .post(this.endpoints.create_user, data, {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: 'Bearer token',
        },
      })
      .subscribe((res) => {
        console.log('Response:', res);
      });
  }

  updateUser(id: string, data: User) {
    const url = `${this.endpoints.update_user.replace(':id', id)}`;
    console.log(url);
    return this.http
      .put(url, data, {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: 'Bearer token',
        },
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
