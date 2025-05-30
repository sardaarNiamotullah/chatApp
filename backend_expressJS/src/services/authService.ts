// import prisma from "../config/database";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// const SECRET_KEY = "your_secret_key"; // Use an env variable in production
// // const SECRET_KEY = process.env.JWT_SECRET!;
// const SALT_ROUNDS = 10;

// export const registerUser = async (
//   username: string,
//   email: string,
//   password: string,
//   firstName: string,
//   lastName?: string
// ) => {
//   // Hash the password before storing
//   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//   // Create user
//   const user = await prisma.user.create({
//     data: { username, email, password: hashedPassword, firstName, lastName },
//   });

//   // Generate JWT token for the new user
//   const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

//   return { token, user }; // Return the token along with user details
// };


// export const loginUser = async (identifier: string, password: string) => {
//   // Find user by username or email
//   const user = await prisma.user.findFirst({
//     where: {
//       OR: [{ username: identifier }, { email: identifier }],
//     },
//   });

//   if (!user) throw new Error("Invalid Identifier");

//   // Compare the hashed password
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) throw new Error("Wrong Password");

//   // Generate JWT token
//   const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

//   return { token, user };
// };

// //newly added code

// export const generateToken = (user: { id: string; email: string; username: string }) => {
//   return jwt.sign(
//     { id: user.id, email: user.email, username: user.username },
//     SECRET_KEY,
//     { expiresIn: "24h" }
//   );
// };

import prisma from "../config/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = "your_secret_key";
const SALT_ROUNDS = 10;

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName?: string,
  photo?: string // Add photo parameter
) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { 
      username, 
      email, 
      password: hashedPassword, 
      firstName, 
      lastName,
      photo // Include photo
    },
  });

  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      photo: user.photo 
    }, 
    SECRET_KEY, 
    { expiresIn: "1h" }
  );

  return { token, user };
};

export const loginUser = async (identifier: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });

  if (!user) throw new Error("Invalid Identifier");
  if (!user.password) throw new Error("Please use your social login");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Wrong Password");

  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      photo: user.photo 
    }, 
    SECRET_KEY, 
    { expiresIn: "1h" }
  );

  return { token, user };
};

export const generateToken = (user: { 
  id: string; 
  email: string; 
  username: string;
  photo?: string | null;
}) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      photo: user.photo 
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
};