import { getAuthToken } from "./auth";
const API_HOST = "192.168.48.54"; // Your PC's IP address
export const API_URL = `http://${API_HOST}:8000/api`; // Backend URL

export const fetchUsers = async () => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/users`, {
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
