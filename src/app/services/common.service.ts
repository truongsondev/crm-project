import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/interfaces/user.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  getAccessToken(): string {
    const at = localStorage.getItem('at');
    return at ? at : '';
  }

  getRefreshToken(): string {
    const rt = localStorage.getItem('rt');
    return rt ? rt : '';
  }

  handleToken(): Observable<string> {
    const at = this.getAccessToken();
    const rt = this.getRefreshToken();

    if (!at && rt) {
      const user = this.parseToJson();
      if (!user) {
        this.router.navigate(['/auth/sign-in']);
        return of('');
      }

      return this.authService.resetToken(rt, user._id).pipe(
        map((res) => {
          const { accessToken, refreshToken } = res.data.token;
          localStorage.setItem('at', accessToken);
          localStorage.setItem('rt', refreshToken);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          return accessToken;
        }),
        catchError(() => {
          this.router.navigate(['/auth/sign-in']);
          return of('');
        }),
      );
    }

    return of(at || '');
  }

  addCreator(formData: any, id: string) {
    const newFormData = { ...formData, creator_id: id };
    return newFormData;
  }

  parseToJson() {
    const userJson = localStorage.getItem('user');

    if (!userJson) {
      return '';
    }
    const user = JSON.parse(userJson);
    return user;
  }
}
