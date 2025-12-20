import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const AUTH_KEY = 'abtech-auth';

interface LoginResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = '/api/auth';

    // Signals for reactive state
    currentUser = signal<any>(this.getUserFromStorage());

    login(credentials: any): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, credentials).pipe(
            tap(data => {
                this.saveUserToStorage(data);
                this.currentUser.set(data);
            })
        );
    }

    logout() {
        localStorage.removeItem(AUTH_KEY);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        const user = this.getUserFromStorage();
        return user ? user.token : null;
    }

    private saveUserToStorage(user: any) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }

    private getUserFromStorage() {
        const user = localStorage.getItem(AUTH_KEY);
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
