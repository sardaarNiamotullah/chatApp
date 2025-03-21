import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUser(req.params.identifier);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error retrieving user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, email, firstName, lastName } = req.body;
    const user = await userService.updateUser(req.params.identifier, {
      username,
      email,
      firstName,
      lastName,
    });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.identifier);
    res.json({ message: "User deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error deleting user" });
  }
};

