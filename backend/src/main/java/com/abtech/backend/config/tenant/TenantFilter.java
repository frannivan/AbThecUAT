package com.abtech.backend.config.tenant;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(1)
public class TenantFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String tenantHelper = req.getHeader("X-Tenant-ID");

        // If header is missing, maybe fallback to default schema (public) or specific
        // one
        // For security, if multi-tenant, maybe default to "public" or similar.
        // FORCE PUBLIC for Neon/Single-App deployment
        tenantHelper = "public";

        // if (tenantHelper == null) {
        // tenantHelper = "PUBLIC";
        // }

        try {
            TenantContext.setCurrentTenant(tenantHelper);
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
