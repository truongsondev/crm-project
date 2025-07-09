import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FetchListService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getList(pathUrl: string, config: any) {
    let params = new HttpParams();

    for (const key in config) {
      if (config[key] !== undefined && config[key] !== null) {
        params = params.set(key, config[key]);
      }
    }
    console.log(`${this.baseUrl}/${pathUrl}`, params);
    return this.http.get<any[]>(`${this.baseUrl}/${pathUrl}`, { params });
  }
}
