package com.abtech.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.abtech.backend.model.Lead;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByIndustry(String industry);

    List<Lead> findByStatus(com.abtech.backend.model.ELeadStatus status);
}
