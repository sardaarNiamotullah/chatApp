"use client";

import { useSearchParams } from "next/navigation";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // ⬅️ new

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
    const urlToken = searchParams.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      // Clean the URL so token isn't visible anymore
      router.replace("/explore");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router, searchParams]); // ⬅️ added searchParams

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
    console.log(`username provided in pagetsx is: ${username}`);
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
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 relative">
        <h1 className="text-xl font-bold">ChatApp</h1>

        <div className="flex items-center gap-2 relative">
          {ownUsername ? (
            <>
              <button className="text-sm text-gray-300 border px-3 py-1 rounded hover:bg-gray-800">
                @{ownUsername}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="text-gray-300 px-2 py-1 rounded hover:bg-gray-800"
                >
                  ☰
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600 rounded shadow-lg z-10">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white text-sm"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400 animate-pulse">
              Loading...
            </div>
          )}
        </div>
      </div>
      {/* User List */}
      <div className="flex-1 overflow-auto p-4">
        {/* Connection Requests Banner */}
        <div className="bg-gray-800 text-white p-2 mb-2 rounded">
          <h2 className="text-lg font-semibold">Connection Request Box</h2>
        </div>
        {/* Connection Requests */}
        {requests.length === 0 ? (
          <p className="text-gray-400 mb-4">
            Currently you do not have any connection requests.
          </p>
        ) : (
          requests.map((user) => (
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
              <div className="flex space-x-2 w-36">
                <button
                  onClick={() => handleAcceptRequest(user.username)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm flex-1"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeleteRequest(user.username)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* Normal Users */}
        {/* Normal Users Banner */}
        <div className="bg-gray-800 text-white p-2 mt-4 mb-2 rounded">
          <h2 className="text-lg font-semibold">Explore Other Users</h2>
        </div>
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
                className="px-3 py-1 bg-red-500 text-white rounded text-sm whitespace-nowrap w-36"
              >
                Cancel Request
              </button>
            ) : (
              <button
                onClick={() => handleSendRequest(user.username)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm whitespace-nowrap w-36"
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
          Explore Users
        </button>
      </div>
    </div>
  );
}
