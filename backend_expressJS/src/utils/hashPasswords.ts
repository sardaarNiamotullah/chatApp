import bcrypt from "bcryptjs";
import prisma from "../config/database"; // Import the Prisma client

const SALT_ROUNDS = 10; // Adjust as needed

async function hashPasswords() {
  try {
    // Fetch all users
    const users = await prisma.user.findMany();

    for (const user of users) {
      const { id, password } = user;

      // Check if the password is already hashed (assuming bcrypt hash is 60+ characters)
      if (password.length < 60) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Update the user's password with the hashed version
        await prisma.user.update({
          where: { id },
          data: { password: hashedPassword },
        });

        console.log(`Password for user ${id} has been hashed.`);
      } else {
        console.log(`Password for user ${id} is already hashed.`);
      }
    }

    console.log("✅ Password hashing completed.");
  } catch (error) {
    console.error("❌ Error hashing passwords:", error);
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects when the script finishes
  }
}

// Execute the function
hashPasswords();
