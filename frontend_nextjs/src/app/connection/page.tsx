"use client";

import { useEffect, useState } from "react";
import { fetchAcceptedConnections, deleteConnection, fetchOwnProfile } from "@/lib/api/api";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<User[]>([]);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);
  const router = useRouter();

  const loadData = async () => {
    try {
      const [connectionsData, ownUser]: [User[], User | null] = await Promise.all([
        fetchAcceptedConnections(),
        fetchOwnProfile(),
      ]);

      setConnections(connectionsData);
      if (ownUser) setOwnUsername(ownUser.username);
    } catch (err) {
      console.error("Error loading connections:", err);
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

  const handleRemoveConnection = async (username: string) => {
    try {
      await deleteConnection(username);
      await loadData();
    } catch (error) {
      console.error("Error removing connection:", error);
    }
  };

  const handleUsersClick = () => {
    router.push("/home");
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

      {/* Connections List */}
      <div className="flex-1 overflow-auto p-4">
        {connections.map((user) => (
          <div
            key={`connection-${user.username}`}
            className="flex justify-between items-center border-b border-gray-700 p-3"
          >
            <div>
              <p className="text-sm text-gray-400">@{user.username}</p>
              <p className="text-lg">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <button
              onClick={() => handleRemoveConnection(user.username)}
              className="px-4 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-4 border-t border-gray-700 bg-black">
        <button className="flex-1 text-center text-white font-bold">
          Connections
        </button>
        <button 
          onClick={handleUsersClick}
          className="flex-1 text-center text-gray-400 hover:text-white"
        >
          Users
        </button>
      </div>
    </div>
  );
}