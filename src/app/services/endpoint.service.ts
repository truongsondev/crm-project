import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({ providedIn: 'root' })
export class EndpointService {
  constructor(private http: HttpClient) {}
  fetchEndpoint<T = any>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .get<T>(endpoint, {
        observe: 'body',
        ...options,
      } as {
        observe: 'body';
      })
      .pipe(catchError((err: HttpErrorResponse) => this.handleEror<T>(err)));
  }

  postEndpoint<T = any>(
    endpoint: string,
    reqBody: any,
    options?: any,
  ): Observable<T> {
    return this.http
      .post<T>(endpoint, reqBody, {
        observe: 'body',
        ...options,
      } as {
        observe: 'body';
      })
      .pipe(catchError((err: HttpErrorResponse) => this.handleEror<T>(err)));
  }

  putEndpoint<T = any>(
    endpoint: string,
    reqBody: any,
    options?: any,
  ): Observable<T> {
    return this.http
      .put<T>(endpoint, reqBody, {
        observe: 'body',
        ...options,
      } as {
        observe: 'body';
      })
      .pipe(catchError((err) => this.handleEror<T>(err)));
  }

  deleteEndpoint<T = any>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .delete<T>(endpoint, {
        observe: 'body',
        ...options,
      } as {
        observe: 'body';
      })
      .pipe(catchError((err) => this.handleEror<T>(err)));
  }

  handleEror<T>(error: HttpErrorResponse): Observable<T> {
    return throwError(() => new Error('API failed'));
  }
}
