import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private refreshTokenInProgress = false;
  private refreshToken$!: Observable<string>;
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  getAccessToken(): string | null {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? accessToken : null;
  }

  getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken ? refreshToken : null;
  }

  handleToken(): Observable<string> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const tokenExpiry = localStorage.getItem('token_expiry');
    const user = this.parseStringToJson('user');

    if (!refreshToken || !user) {
      localStorage.clear();
      this.router.navigate(['/auth/sign-in']);
      return of('');
    }

    const isExpired = tokenExpiry
      ? Date.now() > parseInt(tokenExpiry, 10)
      : true;

    if (!accessToken || isExpired) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        this.refreshToken$ = this.authService
          .resetToken(refreshToken, user._id)
          .pipe(
            map((res) => {
              const { accessToken, refreshToken } = res.data.token;
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('user', JSON.stringify(res.data.user));

              const decoded = JSON.parse(atob(accessToken.split('.')[1]));
              localStorage.setItem(
                'token_expiry',
                (decoded.exp * 1000).toString(),
              );

              return accessToken;
            }),
            catchError(() => {
              this.router.navigate(['/auth/sign-in']);
              return of('');
            }),
            finalize(() => {
              this.refreshTokenInProgress = false;
            }),
            shareReplay(1),
          );
      }
      return this.refreshToken$;
    }

    return of(accessToken);
  }

  addCreatorToForm(formData: any, id: string) {
    const newFormData = { ...formData, creator_id: id };
    return newFormData;
  }

  parseStringToJson(key: string) {
    const userJson = localStorage.getItem(key);

    if (!userJson) {
      return null;
    }
    const user = JSON.parse(userJson);
    return user;
  }

  withAuth<T>(
    endpoint: string,
    httpFunction: (endpoint: string, options: any) => Observable<T>,
  ) {
    return this.handleToken().pipe(
      switchMap((accessToken) => {
        if (accessToken === '') {
          return EMPTY;
        }
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        });
        return httpFunction(endpoint, { headers });
      }),
    );
  }
}
