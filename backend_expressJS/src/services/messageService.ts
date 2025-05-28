import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendMessage = async (
  senderUsername: string,
  receiverUsername: string,
  text: string
) => {
  return prisma.message.create({
    data: {
      senderUsername,
      receiverUsername,
      text,
      createdAt: new Date(),
    },
  });
};

export const getPendingMessages = async (username: string) => {
  return prisma.message.findMany({
    where: {
      receiverUsername: username,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getConversation = async (
  currentUsername: string,
  otherUsername: string
) => {
  return prisma.message.findMany({
    where: {
      OR: [
        // Messages where current user is sender and other user is receiver
        {
          senderUsername: currentUsername,
          receiverUsername: otherUsername,
        },
        // Messages where current user is receiver and other user is sender
        {
          senderUsername: otherUsername,
          receiverUsername: currentUsername,
        },
      ],
    },
    orderBy: {
      createdAt: "asc", // Oldest first, use "desc" for newest first
    },
    select: {
      id: true,
      text: true,
      status: true,
      createdAt: true,
      senderUsername: true,
      receiverUsername: true,
    },
  });
};