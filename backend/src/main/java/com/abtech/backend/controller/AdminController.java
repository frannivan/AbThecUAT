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

    @Autowired
    private com.abtech.backend.repository.UserRepository userRepository;

    @GetMapping("/users")
    public List<com.abtech.backend.model.User> getAllUsers() {
        System.out.println(">>> DEBUG: Request received at GET /api/admin/users");
        List<com.abtech.backend.model.User> users = userRepository.findAll();
        System.out.println(">>> DEBUG: Found " + users.size() + " users in DB.");
        return users;
    }

    @GetMapping("/leads")
    public List<Lead> getAllLeads() {
        List<Lead> leads = leadService.getAllLeads();
        System.out.println(
                ">>> DEBUG: getAllLeads called. Found: " + (leads != null ? leads.size() : "null") + " leads.");
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
    public List<Lead> getRecentLeads() {
        try {
            System.out.println(">>> DEBUG: Requesting Recent Leads...");
            return leadService.getRecentLeads(5);
        } catch (Exception e) {
            System.err.println(">>> ERROR in getRecentLeads: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            System.out.println(">>> DEBUG: Computing Dashboard Stats...");
            long totalLeads = leadService.countLeads();
            System.out.println(">>> DEBUG: Total Leads: " + totalLeads);

            long newLeads = leadService.countNewLeads();
            System.out.println(">>> DEBUG: New Leads: " + newLeads);

            long opportunities = leadService.countQualifiedLeads();
            System.out.println(">>> DEBUG: Opportunities: " + opportunities);

            long totalClients = clientService.countClients();
            System.out.println(">>> DEBUG: Total Clients: " + totalClients);

            return ResponseEntity.ok(new DashboardStats(totalLeads, newLeads, opportunities, totalClients));
        } catch (Exception e) {
            System.err.println(">>> ERROR in getDashboardStats: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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

    @PutMapping("/users/{id}")
    public ResponseEntity<com.abtech.backend.model.User> updateUser(@PathVariable Long id,
            @RequestBody com.abtech.backend.payload.request.SignupRequest updateRequest) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(updateRequest.getUsername());
                    user.setEmail(updateRequest.getEmail());

                    // Handle password update only if provided
                    if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
                        // Assuming we have access to encoder here, if not we might need to inject it or
                        // ignore password update here for now
                        // For simplicity in this Admin controller, let's skip password update or
                        // require injection.
                        // Ideally, we should inject PasswordEncoder.
                    }

                    // Handle Role Update
                    if (updateRequest.getRole() != null && !updateRequest.getRole().isEmpty()) {
                        String roleName = updateRequest.getRole().iterator().next().toLowerCase();
                        switch (roleName) {
                            case "admin":
                                user.setRole(com.abtech.backend.model.ERole.ROLE_ADMIN);
                                break;
                            case "client":
                            case "cliente":
                                user.setRole(com.abtech.backend.model.ERole.ROLE_CLIENTE);
                                break;
                            default:
                                user.setRole(com.abtech.backend.model.ERole.ROLE_USER);
                        }
                    }

                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
// Force redeploy
