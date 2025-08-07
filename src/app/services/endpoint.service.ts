import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorComponent } from '@app/shares/error/error.component';
import { ModalDiaLogComponent } from '@app/shares/modal/modal.component';
import { catchError, of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ModalService } from './modal.service';
import { ERROR_MESSAGES } from '@app/constants/shared.constant';
@Injectable({ providedIn: 'root' })
export class EndpointService {
  constructor(
    private http: HttpClient,
    private modalService: ModalService,
  ) {}
  fetchEndpoint<T = any>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .get<T>(endpoint, {
        observe: 'body',
        ...options,
      } as {
        observe: 'body';
      })
      .pipe(catchError((err: HttpErrorResponse) => this.handleError<T>(err)));
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
      .pipe(catchError((err: HttpErrorResponse) => this.handleError<T>(err)));
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
      .pipe(catchError((err) => this.handleError<T>(err)));
  }

  deleteEndpoint<T = any>(endpoint: string, options?: any): Observable<T> {
    return this.http
      .delete<T>(endpoint, {
        observe: 'body',
        ...options,
      } as {
        observe: 'body';
      })
      .pipe(catchError((err) => this.handleError<T>(err)));
  }

  showError(title: string, message: string) {
    return this.modalService.openFilter(
      ModalDiaLogComponent,
      ErrorComponent,
      title,
      {
        action: '',
        dataList: [],
        dataSelected: null,
        message: message,
        from: '',
      },
    );
  }

  handleError<T>(error: HttpErrorResponse): Observable<T> {
    const httpStatus = error.status;
    const message = error.error.message;
    console.log(error);
    return this.showError(
      ERROR_MESSAGES[httpStatus].title || 'Invalid Error',
      message ||
        ERROR_MESSAGES[httpStatus].message ||
        'An unknown error occurred',
    );
  }
}
