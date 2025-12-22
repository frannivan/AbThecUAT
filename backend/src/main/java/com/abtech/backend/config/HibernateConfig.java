package com.abtech.backend.config;

import com.abtech.backend.config.tenant.MultiTenantProvider;
import com.abtech.backend.config.tenant.SchemaResolver;
import org.hibernate.MultiTenancyStrategy;
import org.hibernate.cfg.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class HibernateConfig {

    @Autowired
    private JpaProperties jpaProperties;

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource,
            MultiTenantProvider multiTenantProvider,
            SchemaResolver schemaResolver) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("com.abtech.backend.model");
        em.setJpaVendorAdapter(jpaVendorAdapter());

        Map<String, Object> properties = new HashMap<>(jpaProperties.getProperties());

        // Multi-tenancy configuration
        properties.put(Environment.MULTI_TENANT, MultiTenancyStrategy.SCHEMA);
        properties.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantProvider);
        properties.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, schemaResolver);

        // Disable DDL auto for safety in production, or set to update/none
        // properties.put(Environment.HBM2DDL_AUTO, "update");

        em.setJpaPropertyMap(properties);
        return em;
    }
}
