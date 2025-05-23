import socket from "./socket";

interface Message {
  id: number;
  text: string;
  senderUsername: string;
  receiverUsername: string;
  createdAt: string;
}

export const connectSocket = (username: string) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit("register", username);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.emit("disconnect_connection");
    socket.disconnect();
  }
};

export const onReceiveMessage = (callback: (message: Message) => void) => {
  socket.on("receive_message", callback);
};

export const offReceiveMessage = () => {
  socket.off("receive_message");
};

export const sendMessageSocket = (
  senderUsername: string,
  receiverUsername: string,
  text: string
) => {
  socket.emit("send_message", { senderUsername, receiverUsername, text });
};