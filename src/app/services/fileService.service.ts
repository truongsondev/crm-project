import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndpointService } from './endpoint.service';
import { getEndpoints } from '@app/constants/endpoints.constant';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private endpointService: EndpointService) {}

  downloadFile(endpoint: string): Observable<Blob> {
    return this.endpointService.fetchEndpoint(endpoint, {
      responseType: 'blob',
    });
  }
}
