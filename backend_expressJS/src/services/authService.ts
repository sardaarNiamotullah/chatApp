import prisma from "../config/database";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName?: string
) => {
  return prisma.user.create({
    data: { username, email, password, firstName, lastName },
  });
};

export const loginUser = async (identifier: string, password: string) => {
  // Find user by ID, username, or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { username: identifier }, { email: identifier }],
    },
  });

  if (!user) throw new Error("Invalid Identifier");

  // Check if password matches (direct comparison)
  if (user.password !== password) throw new Error("Wrong Password");

  return user;
};
