import { getAuthToken } from "./auth";

const API_HOST = "192.168.101.54"; // Your PC's IP address
export const API_URL = `http://${API_HOST}:8000/api`; // Backend URL

// Send a message to another user
export const sendMessage = async (receiverUsername: string, text: string) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        receiverUsername,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Re-throw to let components handle the error
  }
};

// Get conversation between current user and another user
export const getConversation = async (otherUsername: string) => {
  const token = getAuthToken();

  try {
    const response = await fetch(
      `${API_URL}/messages/conversation/${otherUsername}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error; // Re-throw to let components handle the error
  }
};