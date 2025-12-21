package com.abtech.backend.controller;

import com.abtech.backend.model.ELeadStatus;
import com.abtech.backend.model.Lead;
import com.abtech.backend.model.Client;
import com.abtech.backend.service.ClientService;
import com.abtech.backend.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private LeadService leadService;

    @Autowired
    private ClientService clientService;

    @GetMapping("/leads")
    public List<Lead> getAllLeads(@RequestHeader(value = "X-App-ID", required = false) String appId) {
        List<Lead> leads = leadService.getAllLeads(appId);
        System.out.println(
                ">>> DEBUG: getAllLeads called for AppID: " + appId + ". Found: "
                        + (leads != null ? leads.size() : "null") + " leads.");
        return leads;
    }

    @GetMapping("/leads/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        System.out.println(">>> DEBUG: getLeadById called for ID: " + id);
        return leadService.getLeadById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    System.out.println(">>> DEBUG: Lead not found with ID: " + id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/leads/recent")
    public List<Lead> getRecentLeads(@RequestHeader(value = "X-App-ID", required = false) String appId) {
        return leadService.getRecentLeads(5, appId);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(@RequestHeader(value = "X-App-ID", required = false) String appId) {
        long totalLeads = leadService.countLeads(appId);
        long newLeads = leadService.countNewLeads(appId);
        long opportunities = leadService.countQualifiedLeads(appId);
        long totalClients = clientService.countClients(); // Clients might need separation too later
        return ResponseEntity.ok(new DashboardStats(totalLeads, newLeads, opportunities, totalClients));
    }

    // Clients Endpoints
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/clients")
    public Client createClient(@RequestBody Client client) {
        return clientService.saveClient(client);
    }

    @PostMapping("/leads/{id}/convert")
    public ResponseEntity<?> convertLeadToClient(@PathVariable Long id) {
        try {
            Lead updated = leadService.updateStatus(id, ELeadStatus.CONVERTED);
            // Find the newly created client (this is a bit simplistic, but let's assume it
            // works for now)
            // Or better, let the service return something more descriptive.
            // For now, returning the updated lead is fine.
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Inner DTO for stats
    static class DashboardStats {
        public long totalLeads;
        public long newLeads;
        public long opportunities;
        public long totalClients;

        public DashboardStats(long totalLeads, long newLeads, long opportunities, long totalClients) {
            this.totalLeads = totalLeads;
            this.newLeads = newLeads;
            this.opportunities = opportunities;
            this.totalClients = totalClients;
        }
    }

    @PutMapping("/leads/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            ELeadStatus eStatus = ELeadStatus.valueOf(status.replace("\"", ""));
            Lead updated = leadService.updateStatus(id, eStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/leads/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @RequestBody Lead leadDetails) {
        try {
            Lead updated = leadService.updateLead(id, leadDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
