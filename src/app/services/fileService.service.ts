import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from './endpoint.service';

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
