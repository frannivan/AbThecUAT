import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { AdminService } from '../../../services/admin';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.html'
})
export class Dashboard {
    authService = inject(AuthService);
    adminService = inject(AdminService);
    currentUser = this.authService.currentUser;

    stats = signal({ totalLeads: 0, newLeads: 0, opportunities: 0, totalClients: 0 });
    recentLeads = signal<any[]>([]);

    constructor() {
        this.loadStats();
        this.loadRecentLeads();
    }

    loadStats() {
        this.adminService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats.set(data);
            },
            error: (err) => console.error('Error loading stats', err)
        });
    }

    loadRecentLeads() {
        this.adminService.getRecentLeads().subscribe({
            next: (data: any[]) => {
                this.recentLeads.set(data);
            },
            error: (err: any) => console.error('Error loading recent leads', err)
        });
    }

    logout() {
        this.authService.logout();
    }
}
