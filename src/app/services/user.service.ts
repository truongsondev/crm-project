import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { User } from '@app/interfaces/user.interface';
import {
  UserResponse,
  UsersResponse,
} from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private endpointService: EndpointService) {}
  private readonly endpoints = getEndpoints().user.v1;
  getListUser() {
    const endpoint = getEndpoints().user.v1.users;
    return this.endpointService.fetchEndpoint<UsersResponse>(endpoint);
  }

  createUser(data: any) {
    const endpoint = getEndpoints().user.v1.create_user;
    return this.endpointService.postEndpoint<UserResponse>(endpoint, data);
  }
  createUsers(data: any) {
    const endpoint = getEndpoints().user.v1.create_users;
    return this.endpointService.postEndpoint<UsersResponse>(endpoint, data, {
      
    });
  }

  updateUser(id: string, data: User) {
    const url = `${this.endpoints.update_user.replace(':id', id)}`;
    return this.endpointService.putEndpoint<UserResponse>(url, data);
  }
}
