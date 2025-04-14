import { getAuthToken } from "./auth";

const API_HOST = "localhost"; // Your PC's IP address
export const API_URL = `http://${API_HOST}:8000/api`; // Backend URL

// Fetch logged-in user's own profile
export const fetchOwnProfile = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching own profile:", error);
    return null;
  }
};

// Fetch all users
export const fetchUsers = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/users/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fetch users to whom I haven't sent a connection request and they haven't sent me one
export const fetchNotSentRequests = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/users/not-sent-requests-to-me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch not-sent-requests: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching available users:", error);
    return [];
  }
};


// Fetch connection requests (Users who sent a request to the logged-in user)
export const fetchConnectionRequests = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/connections/requests`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch connection requests: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const sendConnectionRequest = async (userBUsername: string) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/connections/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ userBUsername }), // Correct payload format
    });

    if (!response.ok) {
      const errorMessage = await response.json(); // Read backend error message
      throw new Error(
        `Failed to send connection request: ${errorMessage.error}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const cancelConnectionRequest = async (userBUsername: string) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/connections/cancel`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ userBUsername }), // Send username to cancel request
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(
        `Failed to cancel connection request: ${errorMessage.error}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Accept a connection request
export const acceptConnectionRequest = async (userBUsername: string) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/connections/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ userBUsername }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to accept connection request: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete a connection request
export const deleteConnectionRequest = async (userBUsername: string) => {
  const token = getAuthToken();

  console.log(`inside api here userBusername is: ${userBUsername}`);
  try {
    const response = await fetch(`${API_URL}/connections/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ userBUsername }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete connection request: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Check if two users are connected
export const checkIfConnected = async (userBUsername: string) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/connections/areconnected`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ userBUsername }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to check connection status: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.isFriend;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Fetch users I am connected to (ACCEPTED connections only)
export const fetchAcceptedConnections = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/connections/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch accepted connections: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching accepted connections:", error);
    return [];
  }
};

export const deleteConnection = async (username: string) => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/connections/delete`, {
      method: "POST", // Or DELETE if you're sticking with REST semantics
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete connection: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting connection:", error);
    throw error;
  }
};