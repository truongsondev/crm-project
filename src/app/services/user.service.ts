import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { User } from '@app/interfaces/user.interface';
import { FileImportResponse } from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';
import { CommonService } from './common.service';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private endpointService: EndpointService,
    private commonService: CommonService,
  ) {}
  private readonly endpoints = getEndpoints().user.v1;

  getListUser() {
    const endpoint = this.endpoints.users;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.fetchEndpoint<User[]>(url, options),
    );
  }

  createUser(data: any) {
    const endpoint = this.endpoints.createUser;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.postEndpoint<User>(url, data, options),
    );
  }

  createUsers(data: any) {
    const endpoint = this.endpoints.createUsers;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.postEndpoint<FileImportResponse>(url, data, options),
    );
  }

  updateUser(id: string, data: User) {
    const endpoint = `${this.endpoints.updateUser}/${id}`;
    return this.commonService.withAuth(endpoint, (url, options) =>
      this.endpointService.pactchEndpoint<User>(url, data, options),
    );
  }
}
