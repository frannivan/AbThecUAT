import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
    selector: 'app-client-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './client-detail.html'
})
export class ClientDetail implements OnInit {
    private route = inject(ActivatedRoute);
    private adminService = inject(AdminService);

    client = signal<any>(null);
    isLoading = signal<boolean>(true);

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadClient(id);
        }
    }

    loadClient(id: number) {
        this.isLoading.set(true);
        this.adminService.getClientById(id).subscribe({
            next: (data) => {
                this.client.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading client:', err);
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
