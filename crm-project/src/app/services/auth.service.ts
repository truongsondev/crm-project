import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import {
  LoginResponse,
  TokenResponse,
} from '@app/interfaces/response.interface';
import { EndpointService } from './endpoint.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private endpointService: EndpointService) {}
  private readonly endpoints = getEndpoints().auth.v1;
  signIn(data: { user_name: string; password: string }) {
    return this.endpointService.postEndpoint<LoginResponse>(
      this.endpoints.signIn,
      data,
    );
  }

  resetToken(refreshToken: string, id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${refreshToken}`,
    });
    const body = { id };
    return this.endpointService.postEndpoint<TokenResponse>(
      this.endpoints.resetToken,
      body,
      { headers },
    );
  }
}
