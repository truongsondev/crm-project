import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { DataLoginResponse } from '@app/interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  private readonly endpoints = getEndpoints().auth.v1;
  signIn(data: { user_name: string; password: string }) {
    return this.http.post<DataLoginResponse>(this.endpoints.signIn, data);
  }
}
