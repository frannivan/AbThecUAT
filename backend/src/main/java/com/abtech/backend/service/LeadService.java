package com.abtech.backend.service;

import com.abtech.backend.model.ELeadStatus;
import com.abtech.backend.model.Lead;
import com.abtech.backend.model.Client;
import com.abtech.backend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeadService {
    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private ClientService clientService;

    @Autowired
    private EmailService emailService;

    public Lead createLead(Lead lead) {
        if (lead.getStatus() == null) {
            lead.setStatus(ELeadStatus.NEW);
        }
        Lead saved = leadRepository.save(lead);
        try {
            emailService.sendEmail(
                    "admin@abtech.com",
                    "Nuevo Lead: " + (saved.getFullName() != null ? saved.getFullName() : saved.getName()),
                    "Has recibido un nuevo lead desde la web.\n\n" +
                            "Nombre Completo: " + (saved.getFullName() != null ? saved.getFullName() : saved.getName())
                            + "\n" +
                            "Email: " + saved.getEmail() + "\n" +
                            "Teléfono: " + (saved.getPhone() != null ? saved.getPhone() : "No proporcionado") + "\n" +
                            "Origen: " + (saved.getSource() != null ? saved.getSource() : "Desconocido") + "\n" +
                            "Mensaje: " + saved.getMessage());
        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
        }
        return saved;
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public Optional<Lead> getLeadById(Long id) {
        return leadRepository.findById(id);
    }

    public Lead updateStatus(Long id, ELeadStatus status) {
        Lead lead = leadRepository.findById(id).orElseThrow(() -> new RuntimeException("Lead not found"));

        // If status is changed to CONVERTED and it wasn't already, create a client
        if (status == ELeadStatus.CONVERTED && lead.getStatus() != ELeadStatus.CONVERTED) {
            Client client = new Client(
                    lead.getFullName() != null ? lead.getFullName() : lead.getName(),
                    lead.getEmail(),
                    lead.getPhone(),
                    lead.getIndustry());
            clientService.saveClient(client);
        }

        lead.setStatus(status);
        return leadRepository.save(lead);
    }

    public long countLeads() {
        return leadRepository.count();
    }

    public long countNewLeads() {
        return leadRepository.findAll().stream().filter(l -> l.getStatus() == ELeadStatus.NEW).count();
    }

    public long countQualifiedLeads() {
        return leadRepository.findAll().stream().filter(l -> l.getStatus() == ELeadStatus.QUALIFIED).count();
    }

    public Lead saveLead(Lead lead) {
        return leadRepository.save(lead);
    }

    public List<Lead> getRecentLeads(int limit) {
        // Simple manual limiting for now, or could use Pageable
        List<Lead> all = leadRepository.findAll();
        all.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return all.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }

    public Lead updateLead(Long id, Lead details) {
        Lead lead = leadRepository.findById(id).orElseThrow(() -> new RuntimeException("Lead not found"));
        if (details.getName() != null)
            lead.setName(details.getName());
        if (details.getFullName() != null)
            lead.setFullName(details.getFullName());
        if (details.getEmail() != null)
            lead.setEmail(details.getEmail());
        if (details.getPhone() != null)
            lead.setPhone(details.getPhone());
        if (details.getIndustry() != null)
            lead.setIndustry(details.getIndustry());
        if (details.getMessage() != null)
            lead.setMessage(details.getMessage());
        return leadRepository.save(lead);
    }
}
