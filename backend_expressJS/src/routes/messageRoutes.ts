import { Router } from "express";
import * as messageController from "../controllers/messageController";

const router = Router();

router.post("/send", messageController.sendMessage);
router.get("/conversation/:user1/:user2", messageController.getConversation);

export default router;
