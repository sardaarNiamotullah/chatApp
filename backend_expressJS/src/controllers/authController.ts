// import { Request, Response } from "express";
// import * as authService from "../services/authService";
// import { NextFunction } from "express";

// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { username, email, password, firstName, lastName } = req.body;
//     const user = await authService.registerUser(
//       username,
//       email,
//       password,
//       firstName,
//       lastName
//     );
//     res.status(201).json(user);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || "Error creating user" });
//   }
// };


// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { identifier, password } = req.body;
//     const { token, user } = await authService.loginUser(identifier, password);
//     res.json({ token, user });
//   } catch (error: any) {
//     res.status(400).json({ error: error.message || "Error logging in" });
//   }
// };



// export const googleOAuthCallback = async (
//   req: Request,
//   res: Response,
//   _next: NextFunction
// ): Promise<void> => {
//   try {
//     const user = req.user as any;

//     if (!user) {
//       return res.redirect("http://localhost:3000/login?error=google_auth_failed");
//     }

//     const token = authService.generateToken(user);

//     // Redirect user to frontend
//     res.redirect(`http://localhost:3000/connection?token=${token}`);
//   } catch (error) {
//     console.error(error);
//     res.redirect("http://localhost:3000/login?error=internal_server_error");
//   }
// };

import { Request, Response } from "express";
import * as authService from "../services/authService";
import { NextFunction } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const user = await authService.registerUser(
      username,
      email,
      password,
      firstName,
      lastName,
    );
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error creating user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const { token, user } = await authService.loginUser(identifier, password);
    res.json({ token, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error logging in" });
  }
};

export const googleOAuthCallback = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as {
      id: string;
      email: string;
      username: string;
      photo?: string;
    };

    if (!user) {
      return res.redirect("http://localhost:3000/login?error=google_auth_failed");
    }

    const token = authService.generateToken(user);
    res.redirect(`http://localhost:3000/connection?token=${token}`);
  } catch (error) {
    console.error(error);
    res.redirect("http://localhost:3000/login?error=internal_server_error");
  }
};