import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private http = inject(HttpClient);
  private apiUrl = '/api/public/contact';

  createLead(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
