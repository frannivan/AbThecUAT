package com.abtech.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.abtech.backend.model.Lead;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    // Basic standard methods are included by JpaRepository

    // Multi-tenant filters
    List<Lead> findByAppId(String appId);

    long countByAppId(String appId);

    List<Lead> findByIndustry(String industry);

    List<Lead> findByStatus(com.abtech.backend.model.ELeadStatus status);
}
