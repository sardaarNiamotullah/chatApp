import prisma from "../config/database";
import { ConnectionStatus } from "@prisma/client";

export const getConnections = async (currentUsername: string) => {
  // Step 1: Only fetch ACCEPTED connections involving the current user
  const connections = await prisma.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { userAUsername: currentUsername },
        { userBUsername: currentUsername },
      ],
    },
  });

  // Step 2: Map to list of other users with status
  const connectionMap = connections.map((conn) => {
    const otherUsername =
      conn.userAUsername === currentUsername
        ? conn.userBUsername
        : conn.userAUsername;

    return {
      username: otherUsername,
      status: conn.status, // dynamic: will always be "ACCEPTED" in this case
    };
  });

  const otherUsernames = connectionMap.map((c) => c.username);

  // Step 3: Get user details, including photo
  const users = await prisma.user.findMany({
    where: {
      username: {
        in: otherUsernames,
      },
    },
    select: {
      username: true,
      firstName: true,
      lastName: true,
      photo: true, // Add photo field
    },
  });

  // Step 4: Merge user info with status
  return users.map((user) => {
    const connection = connectionMap.find((c) => c.username === user.username);
    return {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo, // Include photo in the response
      status: connection?.status || null, // should always be "ACCEPTED" here
    };
  });
};

export const areConnected = async (
  userAUsername: string,
  userBUsername: string
) => {
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

export const sendConnectionRequest = async (
  userAUsername: string,
  userBUsername: string
) => {
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

export const cancelConnectionRequest = async (
  userAUsername: string,
  userBUsername: string
) => {
  const existingConnection = await prisma.connection.findFirst({
    where: {
      userAUsername,
      userBUsername,
      status: "PENDING", // Only allow canceling pending requests
    },
  });

  if (!existingConnection) {
    throw new Error("No pending connection request found.");
  }

  return prisma.connection.delete({
    where: { id: existingConnection.id },
  });
};

export const acceptConnectionRequest = async (
  userAUsername: string,
  userBUsername: string
) => {
  const connection = await prisma.connection.findFirst({
    where: {
      userAUsername: userBUsername,
      userBUsername: userAUsername,
      status: ConnectionStatus.PENDING,
    },
  });

  if (!connection) {
    throw new Error("No pending connection request found.");
  }

  return prisma.connection.update({
    where: { id: connection.id },
    data: { status: ConnectionStatus.ACCEPTED },
  });
};

export const deleteConnection = async (
  currentUsername: string,
  otherUsername: string
) => {
  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAUsername: currentUsername, userBUsername: otherUsername },
        { userAUsername: otherUsername, userBUsername: currentUsername },
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

export const getConnectionRequests = async (username: string) => {
  return prisma.connection.findMany({
    where: {
      userBUsername: username, // Fetch requests where the user is the recipient
      status: ConnectionStatus.PENDING,
    },
    include: {
      userA: true, // This will fetch the full details of userA
    },
  });
};
