import prisma from "../config/database";

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
      status: "SENT",
    },
  });
};

export const getConversation = async (user1: string, user2: string) => {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderUsername: user1, receiverUsername: user2 },
        { senderUsername: user2, receiverUsername: user1 },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};