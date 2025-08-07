import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { DataLoginResponse } from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private endpointService: EndpointService) {}
  private readonly endpoints = getEndpoints().auth.v1;
  signIn(data: { user_name: string; password: string }) {
    return this.endpointService.postEndpoint<DataLoginResponse>(
      this.endpoints.signIn,
      data,
    );
  }

  resetToken() {
    //return this.endpointService.postEndpoint<any>(this.endpoints.resetToken);
  }
}
