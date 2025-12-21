import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/admin';

    private getHeaders() {
        const token = this.authService.getToken();
        console.log('>>> [AdminService] Getting headers. Token exists:', !!token);
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getDashboardStats(): Observable<any> {
        console.log('>>> [AdminService] Fetching dashboard stats...');
        return this.http.get(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() });
    }

    getAllLeads(): Observable<any[]> {
        console.warn('!!! [AdminService] FETCHING ALL LEADS NOW !!!');
        const headers = this.getHeaders();
        console.log('!!! [AdminService] Headers being used:', headers);
        return this.http.get<any[]>(`${this.apiUrl}/leads`, { headers });
    }

    getLeadById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/leads/${id}`, { headers: this.getHeaders() });
    }

    updateLeadStatus(id: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/leads/${id}/status`, status, { headers: this.getHeaders() });
    }

    // Client Methods
    getAllClients(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/clients`, { headers: this.getHeaders() });
    }

    getClientById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/clients/${id}`, { headers: this.getHeaders() });
    }

    createClient(client: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/clients`, client, { headers: this.getHeaders() });
    }

    convertLeadToClient(id: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/leads/${id}/convert`, {}, { headers: this.getHeaders() });
    }

    updateLead(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/leads/${id}`, data, { headers: this.getHeaders() });
    }

    getRecentLeads(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/leads/recent`, { headers: this.getHeaders() });
    }
}
