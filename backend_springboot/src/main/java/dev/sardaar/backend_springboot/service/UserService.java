package dev.sardaar.backend_springboot.service;

import dev.sardaar.backend_springboot.entity.User;
import dev.sardaar.backend_springboot.repository.UserRepository;
import dev.sardaar.backend_springboot.dto.RegisterDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

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
}
