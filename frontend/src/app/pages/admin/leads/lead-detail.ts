import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
    selector: 'app-lead-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './lead-detail.html'
})
export class LeadDetail implements OnInit {
    adminService = inject(AdminService);
    route = inject(ActivatedRoute);

    lead = signal<any>(null);
    isLoading = signal<boolean>(true);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadLead(Number(id));
        }
    }

    loadLead(id: number) {
        this.isLoading.set(true);
        this.adminService.getLeadById(id).subscribe({
            next: (data) => {
                this.lead.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading lead', err);
                this.isLoading.set(false);
            }
        });
    }

    convertToClient() {
        if (!confirm('¿Seguro que deseas convertir este lead en cliente?')) return;

        this.adminService.convertLeadToClient(this.lead().id).subscribe({
            next: () => {
                alert('Lead convertido exitosamente. Ahora puedes encontrarlo en el listado de Clientes.');
                this.loadLead(this.lead().id);
            },
            error: (err) => console.error('Error converting lead:', err)
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'CONTACTED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'QUALIFIED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'CONVERTED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'LOST': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }
}
