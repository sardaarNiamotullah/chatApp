package dev.sardaar.backend_springboot.service;

import dev.sardaar.backend_springboot.dto.LogInDTO;
import dev.sardaar.backend_springboot.dto.RegisterDTO;
import dev.sardaar.backend_springboot.entity.User;
import dev.sardaar.backend_springboot.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Register a new user
    public void registerUser(RegisterDTO registerDTO) {
        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(registerDTO.getPassword());

        // Create a new User object
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(hashedPassword);

        // Save the user to the database
        userRepository.save(user);
    }

    // Validate user credentials
    public String logInUser(LogInDTO logInDTO) {
        User user = userRepository.findById(logInDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User with username " + logInDTO.getUsername() + " not found."));
        // Check if the password matches
        if (!passwordEncoder.matches(logInDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        return "Login successful!";
    }
}