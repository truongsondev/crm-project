import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { User } from '@app/interfaces/user.interface';
import {
  UserResponse,
  UsersResponse,
} from '@app/interfaces/response.interface';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  private readonly endpoints = getEndpoints().user.v1;
  getListUser() {
    return this.http.get<UsersResponse>(`${this.endpoints.users}`);
  }

  createUser(data: any) {
    return this.http.post<UserResponse>(this.endpoints.create_user, data, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer token',
      },
    });
  }

  updateUser(id: string, data: User) {
    const url = `${this.endpoints.update_user.replace(':id', id)}`;
    console.log(url);
    return this.http.put<UserResponse>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer token',
      },
    });
  }
}
