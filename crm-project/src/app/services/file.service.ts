import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    private endpointService: EndpointService,
    private commonService: CommonService,
  ) {}

  downloadFile(endpoint: string): Observable<Blob> {
    return this.commonService.withAuth(endpoint, (url, option) =>
      this.endpointService.fetchEndpoint(url, {
        ...option,
        responseType: 'blob',
      }),
    );
  }
}
