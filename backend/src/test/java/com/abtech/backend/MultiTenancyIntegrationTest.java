package com.abtech.backend;

import com.abtech.backend.model.Lead;
import com.abtech.backend.repository.LeadRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MultiTenancyIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // We cannot easily clear DB here across schemas without more logic,
        // but for this test we rely on the fact that new records are created.
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    public void testTenantIsolation() throws Exception {
        // 1. Create a Lead in Tenant AbTech
        Lead leadA = new Lead();
        leadA.setName("AbTech Lead");
        leadA.setEmail("lead@abtech.com");
        leadA.setMessage("Message for AbTech");
        leadA.setIndustry("Tech");
        leadA.setSource("Test");

        mockMvc.perform(post("/api/public/contact")
                .header("X-Tenant-ID", "abtech")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(leadA)))
                .andDo(print())
                .andExpect(status().isOk());

        // 2. Verify Lead exists in Tenant AbTech (Admin View)
        mockMvc.perform(get("/api/admin/leads")
                .header("X-Tenant-ID", "abtech"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.email == 'lead@abtech.com')]").exists());

        // 3. Verify Lead does NOT exist in Tenant BarberShop
        mockMvc.perform(get("/api/admin/leads")
                .header("X-Tenant-ID", "barbershop"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.email == 'lead@abtech.com')]").doesNotExist());
    }
}
