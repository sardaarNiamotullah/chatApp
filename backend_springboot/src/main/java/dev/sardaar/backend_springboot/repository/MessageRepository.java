package dev.sardaar.backend_springboot.repository;

import dev.sardaar.backend_springboot.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderUsernameOrReceiverUsername(String senderUsername, String receiverUsername);
}
