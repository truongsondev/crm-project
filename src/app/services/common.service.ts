import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommomService {
  constructor(private router: Router) {}
  getAccessToken(): string {
    const at = localStorage.getItem('at');
    return at ? at : '';
  }

  getRefreshToken(): string {
    const at = localStorage.getItem('at');
    return at ? at : '';
  }

  handlToken(): string {
    const at = this.getAccessToken();
    const rt = this.getRefreshToken();
    if (at === '' && rt === '') {
      this.router.navigate(['/auth/sign-up']);
      return '';
    }
    if (at === '') {
      //resetAccessToken
    }

    return '';
  }
}
