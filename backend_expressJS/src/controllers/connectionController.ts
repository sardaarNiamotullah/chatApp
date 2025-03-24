import { Request, Response } from "express";
import * as connectionService from "../services/connectionService";

export const getConnections = async (req: Request, res: Response) => {
  try {
    const userAUsername = (req as any).user.username;
    const connections = await connectionService.getConnections(userAUsername);
    res.json(connections);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const areConnected = async (req: Request, res: Response) => {
  try {
    const userAUsername = (req as any).user.username;
    const { userBUsername } = req.body;
    const isFriend = await connectionService.areConnected(userAUsername, userBUsername);
    res.status(200).json({ isFriend });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error checking friendship status" });
  }
};

export const sendRequest = async (req: Request, res: Response) => {
  try {
    const userAUsername = (req as any).user.username;
    const { userBUsername } = req.body;
    const connection = await connectionService.sendConnectionRequest(userAUsername, userBUsername);
    res.status(201).json(connection);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const userAUsername = (req as any).user.username;
    const { userBUsername } = req.body;
    const connection = await connectionService.acceptConnectionRequest(userAUsername, userBUsername);
    res.json(connection);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteConnection = async (req: Request, res: Response) => {
  try {
    const userAUsername = (req as any).user.username;
    const { userBUsername } = req.body;
    await connectionService.deleteConnection(userAUsername, userBUsername);
    res.json({ message: "Connection deleted successfully." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};