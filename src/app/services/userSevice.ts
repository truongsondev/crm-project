import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getEmployees() {
    return this.http.get<any[]>('http://localhost:3000/employees');
  }

  async getEmployeesAsync() {
    return await firstValueFrom(
      this.http.get<any[]>('http://localhost:3000/employees'),
    );
  }
}
