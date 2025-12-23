package com.abtech.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        System.err.println(">>> CRITICAL EXCEPTION CAUGHT IN GLOBAL HANDLER: " + ex.getMessage());
        ex.printStackTrace();

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        try {
            body.put("details", request.getDescription(false));
        } catch (Exception e) {
            body.put("details", "Could not get request details");
        }

        if (ex.getCause() != null) {
            body.put("cause", ex.getCause().getMessage());
        }

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
