import { Server, Socket } from "socket.io";
import * as messageService from "../services/messageService";

const userSocketMap = new Map<string, string>();
const messageQueue = new Map<string, any[]>();

export const handleSocketConnection = (socket: Socket, io: Server) => {
  // console.log("🟢 New client connected:", socket.id);

  socket.on("register", async (username: string) => {
    userSocketMap.set(username, socket.id);
    // console.log(`👤 ${username} registered with socket ID ${socket.id}`);
    // console.log("Current userSocketMap:", Array.from(userSocketMap.entries()));

    // Send queued messages
    if (messageQueue.has(username)) {
      const queuedMessages = messageQueue.get(username)!;
      queuedMessages.forEach((message) => {
        socket.emit("receive_message", message);
      });
      messageQueue.delete(username);
      // console.log(`Sent ${queuedMessages.length} queued messages to ${username}`);
    }

    // Fetch pending messages
    try {
      const pendingMessages = await messageService.getPendingMessages(username);
      // console.log(`Sending ${pendingMessages.length} pending messages to ${username}`);
      pendingMessages.forEach((message) => {
        socket.emit("receive_message", message);
      });
    } catch (err) {
      console.error(`Error fetching pending messages for ${username}:`, err);
    }
  });

  socket.on("send_message", async (data) => {
    const { senderUsername, receiverUsername, text } = data;
    // console.log(`📩 Message from ${senderUsername} to ${receiverUsername}: ${text}`);

    try {
      const message = await messageService.sendMessage(senderUsername, receiverUsername, text);
      // console.log("Saved message:", message);

      const receiverSocketId = userSocketMap.get(receiverUsername);
      // console.log(`Receiver socket ID for ${receiverUsername}: ${receiverSocketId}`);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", message);
        // console.log(`Sent message to ${receiverUsername} (socket: ${receiverSocketId})`);
      } else {
        if (!messageQueue.has(receiverUsername)) {
          messageQueue.set(receiverUsername, []);
        }
        messageQueue.get(receiverUsername)!.push(message);
        // console.log(`Queued message for ${receiverUsername}`);
      }

      // Emit to sender
      const senderSocketId = userSocketMap.get(senderUsername);
      if (senderSocketId) {
        io.to(senderSocketId).emit("receive_message", message);
        // console.log(`Sent message to sender ${senderUsername} (socket: ${senderSocketId})`);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect_connection", () => {
    for (const [username, id] of userSocketMap.entries()) {
      if (id === socket.id) {
        userSocketMap.delete(username);
        // console.log(`🔴 ${username} disconnected and removed from map`);
        break;
      }
    }
    // console.log("Current userSocketMap:", Array.from(userSocketMap.entries()));
  });

  socket.on("disconnect", () => {
    for (const [username, id] of userSocketMap.entries()) {
      if (id === socket.id) {
        userSocketMap.delete(username);
        // console.log(`🔴 ${username} disconnected (automatic) and removed from map`);
        break;
      }
    }
    // console.log("Current userSocketMap:", Array.from(userSocketMap.entries()));
  });
};