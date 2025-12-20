package com.abtech.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        if (mailSender == null) {
            System.out.println(">>> [EmailService] MOCK: Sending email to " + to);
            System.out.println(">>> Subject: " + subject);
            System.out.println(">>> Body: " + body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@abtech.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println(">>> [EmailService] Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send email: " + e.getMessage());
        }
    }
}
