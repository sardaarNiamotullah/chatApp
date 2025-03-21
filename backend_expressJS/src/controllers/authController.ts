import { Request, Response } from "express";
import * as authService from "../services/authService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = await authService.registerUser(
      username,
      email,
      password,
      firstName,
      lastName
    );
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error creating user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier can be ID, username, or email
    const user = await authService.loginUser(identifier, password);

    res.json(user);
  } catch (error: any) {
    res.status(401).json({ error: error.message || "Login failed" });
  }
};

