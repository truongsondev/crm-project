import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  handleToken() {
    try {
      const at = this.getAccessToken();
      const rt = this.getRefreshToken();

      if (at === '' && rt === '') {
        this.router.navigate(['/auth/sign-in']);
        return '';
      }

      if (at === '' && rt !== '') {
        this.authService.resetToken(rt).subscribe((res) => {
          const { accessToken, refreshToken } = res;
          localStorage.setItem('at', accessToken);
          localStorage.setItem('rt', refreshToken);
          return accessToken;
        });
      }
      return at;
    } catch (err) {
      this.router.navigate(['/auth/sign-in']);
      return '';
    }
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
