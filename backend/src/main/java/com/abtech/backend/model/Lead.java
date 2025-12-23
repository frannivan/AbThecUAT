package com.abtech.backend.model;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
@NoArgsConstructor
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String fullName;

    private String phone;

    private String email;

    private String message;

    private String industry; // Fintech, Real Estate, etc.

    private String source; // Form, Chatbot

    @Enumerated(EnumType.STRING)
    private ELeadStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @org.hibernate.annotations.UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Lead(String name, String email, String message, String industry, String source) {
        this.name = name;
        this.fullName = name;
        this.email = email;
        this.message = message;
        this.industry = industry;
        this.source = source;
        this.status = ELeadStatus.NEW;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Lead(String name, String fullName, String phone, String email, String message, String industry,
            String source) {
        this.name = name;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.message = message;
        this.industry = industry;
        this.source = source;
        this.status = ELeadStatus.NEW;
    }
}
