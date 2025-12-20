import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
    selector: 'app-leads',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './leads.html'
})
export class Leads implements OnInit {
    adminService = inject(AdminService);
    route = inject(ActivatedRoute);

    leads = signal<any[]>([]);
    isLoading = signal<boolean>(true);
    statusFilter = signal<string | null>(null);

    filteredLeads = computed(() => {
        const filter = this.statusFilter();
        const allLeads = this.leads();
        if (!filter) return allLeads;
        return allLeads.filter(l => l.status === filter);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.statusFilter.set(params['status'] || null);
        });
        this.loadLeads();
    }

    loadLeads() {
        this.isLoading.set(true);
        console.log('>>> [LeadsComponent] Loading leads...');
        this.adminService.getAllLeads().subscribe({
            next: (data) => {
                console.log('>>> [LeadsComponent] Leads received:', data);
                this.leads.set(data || []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('>>> [LeadsComponent] Error loading leads:', err);
                this.isLoading.set(false);
            }
        });
    }

    clearFilter() {
        this.statusFilter.set(null);
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'CONTACTED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'QUALIFIED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'LOST': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    updateStatus(lead: any, event: any) {
        const newStatus = event.target.value;
        this.adminService.updateLeadStatus(lead.id, newStatus).subscribe({
            next: (updatedLead) => {
                lead.status = updatedLead.status;
                console.log('Lead status updated:', updatedLead);
            },
            error: (err) => {
                console.error('Error updating status', err);
                // Revert change in UI if needed, for now just log
            }
        });
    }
}
