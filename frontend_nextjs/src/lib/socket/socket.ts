import { io } from "socket.io-client";

const socket = io("http://localhost:8000"); // Use your backend URL here

export default socket;