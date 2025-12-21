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

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactForm(
            @RequestBody Lead leadRequest,
            @RequestHeader(value = "X-App-ID", required = false) String appId) {

        // Enforce source if missing
        if (leadRequest.getSource() == null) {
            leadRequest.setSource("WEB_FORM");
        }

        // If appId is null, we might want to assign a default 'unknown' or just leave
        // it null
        // Ideally frontend always sends it.

        Lead savedLead = leadService.createLead(leadRequest, appId);
        return ResponseEntity.ok(savedLead);
    }
}
