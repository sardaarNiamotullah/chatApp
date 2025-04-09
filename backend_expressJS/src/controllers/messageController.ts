import { Request, Response } from "express";
import * as messageService from "../services/messageService";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderUsername = (req as any).user?.username;
    const { receiverUsername, text } = req.body;
    
    if (!senderUsername) {
      res.status(401).json({ error: "Unauthorized - User not logged in" });
      return;
    }
    
    const message = await messageService.sendMessage(senderUsername, receiverUsername, text);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error sending message" });
  }
};

export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUsername = (req as any).user?.username;
    const otherUsername = req.params.otherUsername;

    if (!currentUsername) {
      res.status(401).json({ error: "Unauthorized - User not logged in" });
      return;
    }

    const messages = await messageService.getConversation(currentUsername, otherUsername);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error fetching conversation" });
  }
};