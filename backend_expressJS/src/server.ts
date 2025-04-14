import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { handleSocketConnection } from "./websockets/socket";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your frontend URL in production
  },
});

io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
