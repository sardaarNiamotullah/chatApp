package dev.sardaar.backend_springboot.repository;

import dev.sardaar.backend_springboot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    // User findByusername(String username);
}
