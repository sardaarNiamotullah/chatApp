import prisma from "../config/database";
import { ConnectionStatus } from "@prisma/client";

export const getConnections = async (username: string) => {
  return prisma.connection.findMany({
    where: {
      OR: [{ userAUsername: username }, { userBUsername: username }],
      status: ConnectionStatus.ACCEPTED,
    },
  });
};

export const areConnected = async (userAUsername: string, userBUsername: string) => {
  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAUsername, userBUsername },
        { userAUsername: userBUsername, userBUsername: userAUsername },
      ],
      status: ConnectionStatus.ACCEPTED,
    },
  });

  return !!connection;
};

export const sendConnectionRequest = async (userAUsername: string, userBUsername: string) => {
  if (userAUsername === userBUsername) {
    throw new Error("You cannot send a connection request to yourself.");
  }
  
  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAUsername, userBUsername },
        { userAUsername: userBUsername, userBUsername: userAUsername },
      ],
    },
  });

  if (existingConnection) {
    if (existingConnection.status === "PENDING") {
      throw new Error("Connection request already sent.");
    } else if (existingConnection.status === "ACCEPTED") {
      throw new Error("You are already connected.");
    }
  }

  return prisma.connection.create({
    data: {
      userAUsername,
      userBUsername,
      status: ConnectionStatus.PENDING,
    },
  });
};

export const acceptConnectionRequest = async (userAUsername: string, userBUsername: string) => {
  const connection = await prisma.connection.findFirst({
    where: { userAUsername: userBUsername, userBUsername: userAUsername, status: ConnectionStatus.PENDING },
  });

  if (!connection) {
    throw new Error("No pending connection request found.");
  }

  return prisma.connection.update({
    where: { id: connection.id },
    data: { status: ConnectionStatus.ACCEPTED },
  });
};

export const deleteConnection = async (userAUsername: string, userBUsername: string) => {
  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAUsername, userBUsername },
        { userAUsername: userBUsername, userBUsername: userAUsername },
      ],
    },
  });

  if (!connection) {
    throw new Error("No connection found.");
  }

  return prisma.connection.delete({
    where: { id: connection.id },
  });
};