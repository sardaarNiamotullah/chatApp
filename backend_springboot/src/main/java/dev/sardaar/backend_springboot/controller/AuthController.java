package dev.sardaar.backend_springboot.controller;

import dev.sardaar.backend_springboot.dto.LogInDTO;
import dev.sardaar.backend_springboot.service.AuthService;
import dev.sardaar.backend_springboot.dto.RegisterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register a new user to the system
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterDTO registerDTO) {
        try {
            authService.registerUser(registerDTO);
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Login a user
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody LogInDTO logInDTO) {
        try {
            String message = authService.logInUser(logInDTO);
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}