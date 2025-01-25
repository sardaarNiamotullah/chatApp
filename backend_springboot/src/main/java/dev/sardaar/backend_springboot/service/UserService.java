package dev.sardaar.backend_springboot.service;

import dev.sardaar.backend_springboot.dto.UserDTO;
import dev.sardaar.backend_springboot.entity.User;
import dev.sardaar.backend_springboot.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Get all users
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(user.getUsername());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            return userDTO;
        }).collect(Collectors.toList());
    }

    // Get user by their username
    public Optional<UserDTO> getUserByUsername(String username) {
        return userRepository.findById(username).map(user -> {
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(user.getUsername());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            return userDTO;
        });
    }

    // Edit user details
    public void editUser(String username, UserDTO userDTO) {
        User existingUser = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("User with username " + username + " not found."));

        existingUser.setFirstName(userDTO.getFirstName());
        existingUser.setLastName(userDTO.getLastName());
        existingUser.setEmail(userDTO.getEmail());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
            existingUser.setPassword(hashedPassword);
        }
        userRepository.save(existingUser);
    }

    // Delete a user
    public void deleteUser(String username) {
        if (userRepository.existsById(username)) {
            userRepository.deleteById(username);
        } else {
            throw new RuntimeException("User with username " + username + " not found.");
        }
    }
}
