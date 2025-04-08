import prisma from "../config/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = "your_secret_key"; // Use an env variable in production
const SALT_ROUNDS = 10;

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName?: string
) => {
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword, firstName, lastName },
  });

  // Generate JWT token for the new user
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  return { token, user }; // Return the token along with user details
};


export const loginUser = async (identifier: string, password: string) => {
  // Find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });

  if (!user) throw new Error("Invalid Identifier");

  // Compare the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Wrong Password");

  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  return { token, user };
};
