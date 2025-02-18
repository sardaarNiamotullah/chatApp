package dev.sardaar.backend_springboot.service;

import dev.sardaar.backend_springboot.entity.Message;
import dev.sardaar.backend_springboot.entity.User;
import dev.sardaar.backend_springboot.repository.MessageRepository;
import dev.sardaar.backend_springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // Send a message
    public Message sendMessage(String senderUsername, String receiverUsername, String content) {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setStatus(Message.Status.SENT);

        return messageRepository.save(message);
    }

    // Get all messages between two users
    public List<Message> getMessagesBetweenUsers(String username1, String username2) {
        return messageRepository.findBySenderUsernameOrReceiverUsername(username1, username2);
    }
}
