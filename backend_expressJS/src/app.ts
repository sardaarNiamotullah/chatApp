import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";
import connectionRoutes from "./routes/connectionRoutes";
import { authenticateJWT } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes without any authentications.
app.use("/api", authRoutes);

// Apply authentication middleware globally
app.use(authenticateJWT);

app.use("/api", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);


export default app;
