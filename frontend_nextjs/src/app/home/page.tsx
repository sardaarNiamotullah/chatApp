"use client";

import { useEffect, useState } from "react";
import {
  fetchConnectionRequests,
  sendConnectionRequest,
  cancelConnectionRequest,
  acceptConnectionRequest,
  deleteConnectionRequest,
  fetchOwnProfile,
  fetchNotSentRequests,
} from "@/lib/api/api";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  status?: string | null;
}

interface ConnectionRequest {
  userA: User;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);
  const router = useRouter();

  const loadData = async () => {
    try {
      const [usersData, requestsData, ownUser]: [
        User[],
        ConnectionRequest[],
        User | null
      ] = await Promise.all([
        fetchNotSentRequests(),
        fetchConnectionRequests(),
        fetchOwnProfile(),
      ]);

      setUsers(usersData);
      setRequests(requestsData.map((request) => request.userA));
      if (ownUser) setOwnUsername(ownUser.username);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router]);

  const handleSendRequest = async (username: string) => {
    try {
      await sendConnectionRequest(username);
      await loadData();
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleCancelRequest = async (username: string) => {
    try {
      await cancelConnectionRequest(username);
      await loadData();
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };

  const handleAcceptRequest = async (username: string) => {
    try {
      await acceptConnectionRequest(username);
      await loadData();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDeleteRequest = async (username: string) => {
    try {
      await deleteConnectionRequest(username);
      await loadData();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };
  const handleConnectionsClick = () => {
    router.push("/connection");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">ChatApp</h1>
        {ownUsername ? (
          <button className="text-sm text-gray-300 border px-3 py-1 rounded hover:bg-gray-800">
            @{ownUsername}
          </button>
        ) : (
          <div className="text-sm text-gray-400 animate-pulse">Loading...</div>
        )}
      </div>

      {/* User List */}
      <div className="flex-1 overflow-auto p-4">
        {/* Connection Requests */}
        {requests.map((user) => (
          <div
            key={`request-${user.username}`}
            className="flex justify-between items-center border-b border-gray-700 p-3"
          >
            <div>
              <p className="text-sm text-gray-400">@{user.username}</p>
              <p className="text-lg">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAcceptRequest(user.username)}
                className="px-4 py-1 bg-green-500 text-white rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleDeleteRequest(user.username)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {/* Normal Users */}
        {users.map((user) => (
          <div
            key={`user-${user.username}`}
            className="flex justify-between items-center border-b border-gray-700 p-3"
          >
            <div>
              <p className="text-sm text-gray-400">@{user.username}</p>
              <p className="text-lg">
                {user.firstName} {user.lastName}
              </p>
            </div>
            {user.status === "PENDING" ? (
              <button
                onClick={() => handleCancelRequest(user.username)}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                Cancel Request
              </button>
            ) : (
              <button
                onClick={() => handleSendRequest(user.username)}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                Send Request
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-4 border-t border-gray-700 bg-black">
        <button
          onClick={handleConnectionsClick}
          className="flex-1 text-center text-gray-400"
        >
          Connetions
        </button>
        <button className="flex-1 text-center text-white font-bold">
          Users
        </button>
      </div>
    </div>
  );
}
