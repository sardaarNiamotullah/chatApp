import prisma from "../config/database";

export const getUsers = async () => {
  return prisma.user.findMany();
};

export const getUser = async (identifier: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { username: identifier }, { email: identifier }],
    },
  });
};

export const updateUser = async (
  identifier: string,
  data: { username?: string; email?: string; firstName?: string; lastName?: string }
) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { username: identifier }, { email: identifier }],
    },
  });

  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id: user.id }, // Use the found user's ID
    data,
  });
};


export const deleteUser = async (identifier: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { username: identifier }, { email: identifier }],
    },
  });

  if (!user) throw new Error("User not found");

  return prisma.user.delete({
    where: { id: user.id }, // Use the found user's ID
  });
};