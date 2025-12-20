import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './clients.html'
})
export class Clients implements OnInit {
    adminService = inject(AdminService);

    clients = signal<any[]>([]);
    isLoading = signal<boolean>(true);

    ngOnInit() {
        this.loadClients();
    }

    loadClients() {
        this.isLoading.set(true);
        this.adminService.getAllClients().subscribe({
            next: (data) => {
                this.clients.set(data || []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading clients:', err);
                this.isLoading.set(false);
            }
        });
    }

    getStatusColor(status: string): string {
        return status === 'ACTIVE'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
}
