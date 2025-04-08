// apiClient.ts
import { getAuthToken } from "./auth";

const API_HOST = "192.168.101.54"; // Your PC's IP address
export const API_URL = `http://${API_HOST}:8000/api`;

type Method = "GET" | "POST" | "DELETE" | "PUT";

export const apiRequest = async <T, BodyType = undefined>(
  endpoint: string,
  method: Method = "GET",
  body?: BodyType
): Promise<T> => {
  const token = getAuthToken();

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || response.statusText);
    }

    return data;
  } catch (error) {
    console.error(`API ${method} ${endpoint} failed:`, error);
    throw error;
  }
};
