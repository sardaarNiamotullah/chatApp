import socket from "./socket";

interface Message {
  id: string;
  text: string;
  senderUsername: string;
  receiverUsername: string;
  createdAt: string;
}

export const connectSocket = (username: string) => {
  console.log(`Attempting WebSocket connection for ${username}`);

  if (socket.connected) {
    console.log(`WebSocket already connected for ${username}`);
    socket.emit("register", username);
    console.log(`Emitted register for ${username}`);
    return;
  }

  socket.connect();
  console.log(`WebSocket connecting for ${username}`);

  socket.on("connect", () => {
    console.log(`WebSocket connected for ${username}`);
    socket.emit("register", username);
    console.log(`Emitted register for ${username}`);
  });

  socket.on("connect_error", (err) => {
    console.error(`WebSocket connection error for ${username}:`, err.message);
  });

  socket.on("disconnect", () => {
    console.log(`WebSocket disconnected for ${username}`);
  });

  socket.on("reconnect", () => {
    console.log(`WebSocket reconnected for ${username}`);
    socket.emit("register", username);
    console.log(`Emitted register on reconnect for ${username}`);
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.emit("disconnect_connection");
    socket.disconnect();
    console.log("WebSocket disconnected");
  }
};

export const onReceiveMessage = (callback: (message: Message) => void) => {
  socket.on("receive_message", (message) => {
    console.log("Received message:", message);
    callback(message);
  });
};

export const offReceiveMessage = () => {
  socket.off("receive_message");
  console.log("Removed receive_message listener");
};

export const sendMessageSocket = (
  senderUsername: string,
  receiverUsername: string,
  text: string
) => {
  console.log(`Sending message from ${senderUsername} to ${receiverUsername}: ${text}`);
  socket.emit("send_message", { senderUsername, receiverUsername, text });
};