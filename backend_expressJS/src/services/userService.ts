import prisma from "../config/database";

export const getUsers = async (excludeUsername?: string) => {
  return prisma.user.findMany({
    where: {
      username: {
        not: excludeUsername, // Exclude the logged-in user's username
      },
    },
  });
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

// export const getUsersExcludingRequestSenders = async (currentUsername: string) => {
//   // Step 1: Get usernames who sent a request to the current user
//   const sentToMeConnections = await prisma.connection.findMany({
//     where: {
//       userBUsername: currentUsername,
//     },
//     select: {
//       userAUsername: true,
//     },
//   });

//   const excludedUsernames = sentToMeConnections.map(conn => conn.userAUsername);
//   excludedUsernames.push(currentUsername); // exclude self too

//   // Step 2: Get users not in that list
//   const users = await prisma.user.findMany({
//     where: {
//       username: {
//         notIn: excludedUsernames,
//       },
//     },
//     select: {
//       username: true,
//       firstName: true,
//       lastName: true,
//       // Join connection where current user sent request to this user
//       connectionsB: {
//         where: {
//           userAUsername: currentUsername,
//         },
//         select: {
//           status: true,
//         },
//       },
//     },
//   });

//   // Step 3: Format output
//   return users.map(user => ({
//     username: user.username,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     status: user.connectionsB[0]?.status || null,
//   }));
// };

export const getUsersExcludingRequestSenders = async (currentUsername: string) => {
  // Step 1: Get usernames who sent a request to the current user OR are already friends
  const connectionsToExclude = await prisma.connection.findMany({
    where: {
      OR: [
        // Users who sent requests to current user
        { userBUsername: currentUsername },
        // Users who are already friends with current user (either direction)
        {
          OR: [
            {
              userAUsername: currentUsername,
              status: 'ACCEPTED'
            },
            {
              userBUsername: currentUsername,
              status: 'ACCEPTED'
            }
          ]
        }
      ]
    },
    select: {
      userAUsername: true,
      userBUsername: true,
    },
  });

  // Collect all usernames to exclude
  const excludedUsernames = new Set<string>();
  excludedUsernames.add(currentUsername); // exclude self
  
  connectionsToExclude.forEach(conn => {
    // Add the other user in each connection (whichever isn't the current user)
    if (conn.userAUsername !== currentUsername) {
      excludedUsernames.add(conn.userAUsername);
    }
    if (conn.userBUsername !== currentUsername) {
      excludedUsernames.add(conn.userBUsername);
    }
  });

  // Step 2: Get users not in the excluded list
  const users = await prisma.user.findMany({
    where: {
      username: {
        notIn: Array.from(excludedUsernames),
      },
    },
    select: {
      username: true,
      firstName: true,
      lastName: true,
      // Join connection where current user sent request to this user
      connectionsB: {
        where: {
          userAUsername: currentUsername,
        },
        select: {
          status: true,
        },
      },
    },
  });

  // Step 3: Format output
  return users.map(user => ({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.connectionsB[0]?.status || null,
  }));
};