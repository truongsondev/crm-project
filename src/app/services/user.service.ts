import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { User } from '@app/interfaces/user.interface';
import { DataResponse } from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private endpointService: EndpointService,
    private commonService: CommonService,
    private router: Router,
  ) {}
  private readonly endpoints = getEndpoints().user.v1;

  // lamgido<T>(
  //   endpoint: string,
  //   callback: (endpoint: string, options: any) => Observable<T>,
  // ) {
  //   return this.commonService.handleToken().pipe(
  //     switchMap((at) => {
  //       if (at === '') {
  //         return EMPTY;
  //       }
  //       const headers = new HttpHeaders({
  //         Authorization: `Bearer ${at}`,
  //       });
  //       return callback(endpoint, { headers });
  //     }),
  //   );
  // }

  getListUser() {
    const endpoint = getEndpoints().user.v1.users;

    return this.commonService.handleToken().pipe(
      switchMap((at) => {
        if (at === '') {
          return EMPTY;
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${at}`,
        });
        return this.endpointService.fetchEndpoint<User[]>(endpoint, {
          headers,
        });
      }),
    );
  }

  createUser(data: any) {
    const endpoint = getEndpoints().user.v1.create_user;
    return this.commonService.handleToken().pipe(
      switchMap((at) => {
        if (at === '') {
          return EMPTY;
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${at}`,
        });
        return this.endpointService.postEndpoint<User>(endpoint, data, {
          headers,
        });
      }),
    );
  }
  createUsers(data: any) {
    const endpoint = getEndpoints().user.v1.create_users;
    return this.endpointService.postEndpoint<DataResponse>(endpoint, data, {});
  }

  updateUser(id: string, data: User) {
    const url = `${this.endpoints.update_user.replace(':id', id)}`;
    return this.endpointService.putEndpoint<User>(url, data);
  }
}
