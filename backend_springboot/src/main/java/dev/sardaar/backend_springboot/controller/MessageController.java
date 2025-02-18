package dev.sardaar.backend_springboot.controller;

import dev.sardaar.backend_springboot.entity.Message;
import dev.sardaar.backend_springboot.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Send a message
    @PostMapping("/send")
    public ResponseEntity<Object> sendMessage(@RequestBody Map<String, String> payload) {
        try {
            String sender = payload.get("sender");
            String receiver = payload.get("receiver");
            String content = payload.get("content");

            if (sender == null || receiver == null || content == null) {
                return new ResponseEntity<>("Missing fields", HttpStatus.BAD_REQUEST);
            }

            Message message = messageService.sendMessage(sender, receiver, content);
            return new ResponseEntity<>(message, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get messages between two users
    @GetMapping("/conversation")
    public ResponseEntity<Object> getMessagesBetweenUsers(
            @RequestParam String user1,
            @RequestParam String user2) {
        try {
            List<Message> messages = messageService.getMessagesBetweenUsers(user1, user2);
            if (messages.isEmpty()) {
                return new ResponseEntity<>("No messages found", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
