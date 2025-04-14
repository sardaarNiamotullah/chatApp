import { Server, Socket } from "socket.io";
import * as messageService from "../services/messageService";

// Map to track which username is connected to which socket
const userSocketMap = new Map<string, string>();

export const handleSocketConnection = (socket: Socket, io: Server) => {
  // console.log("🟢 New client connected:", socket.id);

  // 1️⃣ Client sends username after connecting
  socket.on("register", (username: string) => {
    userSocketMap.set(username, socket.id);
    // console.log(`👤 ${username} registered with socket ID ${socket.id}`);
  });

  // 2️⃣ When a message is sent
  socket.on("send_message", async (data) => {
    const { senderUsername, receiverUsername, text } = data;

    const message = await messageService.sendMessage(
      senderUsername,
      receiverUsername,
      text
    );

    const receiverSocketId = userSocketMap.get(receiverUsername);

    if (receiverSocketId) {
      // Only emit to the receiver’s socket
      socket.to(receiverSocketId).emit("receive_message", message);
    }

    // Optionally: emit back to sender for message confirmation
    socket.emit("receive_message", message);
  });

  socket.on("disconnect_connection", () => {
    for (const [username, id] of userSocketMap.entries()) {
      if (id === socket.id) {
        userSocketMap.delete(username);
        // console.log(`🔴 ${username} disconnected and removed from map.`);
        break;
      }
    }
  });
};
