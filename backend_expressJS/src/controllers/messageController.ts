import { Request, Response } from "express";
import * as messageService from "../services/messageService";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderUsername, receiverUsername, text } = req.body;
    const message = await messageService.sendMessage(senderUsername, receiverUsername, text);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error sending message" });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await messageService.getConversation(user1, user2);
    res.json(messages);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error fetching conversation" });
  }
};