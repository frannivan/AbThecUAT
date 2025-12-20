package com.abtech.backend;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.abtech.backend.model.ERole;
import com.abtech.backend.model.User;
import com.abtech.backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", "admin@abtech.com", encoder.encode("123456"));
            admin.setRole(ERole.ROLE_ADMIN);
            userRepository.save(admin);
            System.out.println(">>> ADMIN USER CREATED: Username: 'admin', Password: '123456'");
        }
    }
}
