import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
    selector: 'app-opportunities',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './opportunities.html'
})
export class Opportunities implements OnInit {
    adminService = inject(AdminService);

    leads = signal<any[]>([]);
    isLoading = signal<boolean>(true);

    opportunities = computed(() => {
        return this.leads().filter(l => l.status === 'QUALIFIED');
    });

    ngOnInit() {
        this.loadLeads();
    }

    isNew(updatedAt: string): boolean {
        if (!updatedAt) return false;
        const updateDate = new Date(updatedAt);
        const now = new Date();
        const diffInHours = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24; // Deemed "New" for 24 hours after qualification
    }

    loadLeads() {
        this.isLoading.set(true);
        this.adminService.getAllLeads().subscribe({
            next: (data) => {
                this.leads.set(data || []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading opportunities:', err);
                this.isLoading.set(false);
            }
        });
    }

    getStatusColor(status: string): string {
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }

    updateStatus(lead: any, event: any) {
        const newStatus = event.target.value;
        this.adminService.updateLeadStatus(lead.id, newStatus).subscribe({
            next: (updatedLead) => {
                // Refresh list if status changes from QUALIFIED to something else
                if (newStatus !== 'QUALIFIED') {
                    this.loadLeads();
                } else {
                    lead.status = updatedLead.status;
                }
            },
            error: (err) => console.error('Error updating status', err)
        });
    }
}
