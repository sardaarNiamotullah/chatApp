import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // Replace with your actual secret key

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({ error: "Access denied, no token provided" });
    return; // Ensure function exits after sending response
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: "Invalid token format" });
    return; // Ensure function exits after sending response
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded; // Attach decoded user data to request
    next(); // Call next middleware if successful
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
    return; // Ensure function exits after sending response
  }
};