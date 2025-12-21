package com.abtech.backend.controller;

import com.abtech.backend.model.Lead;
import com.abtech.backend.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private LeadService leadService;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("AbTech API is running correctly!");
    }

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(@RequestBody Lead leadRequest) {
        // Enforce source if missing
        if (leadRequest.getSource() == null) {
            leadRequest.setSource("WEB_FORM");
        }
        Lead savedLead = leadService.createLead(leadRequest);
        return ResponseEntity.ok(savedLead);
    }
}
