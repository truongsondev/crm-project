import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { User } from '@app/interfaces/user.interface';
import {
  DataResponse,
  UserResponse,
  UsersResponse,
} from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private endpointService: EndpointService,
    private commonService: CommonService,
    private router: Router,
  ) {}
  private readonly endpoints = getEndpoints().user.v1;

  getListUser() {
    const endpoint = getEndpoints().user.v1.users;
    // const at = this.commonService.handleToken();
    // console.log('at in get list::::', at);
    // if (at === '') {
    //   return EMPTY;
    // }
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${at}`,
    // });
    return this.endpointService.fetchEndpoint<UsersResponse>(endpoint);
  }

  createUser(data: any) {
    const endpoint = getEndpoints().user.v1.create_user;
    return this.endpointService.postEndpoint<UserResponse>(endpoint, data);
  }
  createUsers(data: any) {
    const endpoint = getEndpoints().user.v1.create_users;
    return this.endpointService.postEndpoint<DataResponse>(endpoint, data, {});
  }

  updateUser(id: string, data: User) {
    const url = `${this.endpoints.update_user.replace(':id', id)}`;
    return this.endpointService.putEndpoint<UserResponse>(url, data);
  }
}
