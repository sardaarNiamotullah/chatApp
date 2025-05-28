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
import UserAvatar from "@/app/Components/UserAvatar";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
  status?: string | null;
}

interface ConnectionRequest {
  userA: User;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

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
      if (ownUser) setCurrentUser(ownUser);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      router.replace("/explore");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router, searchParams]);

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
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
          ChatApp
        </h1>

        <div className="flex items-center gap-2 relative">
          {currentUser ? (
            <>
              <div className="flex items-center gap-3">
                <UserAvatar user={currentUser} size="sm" />
                <button className="text-sm text-gray-300 border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700/50 transition-all">
                  @{currentUser.username}
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700/50 transition-all"
                >
                  ☰
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-800/90 border border-gray-700/50 rounded-lg shadow-xl backdrop-blur-sm z-10 overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-600/50 hover:text-white transition-all flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
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
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Connection Requests Section */}
        <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">Connection Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No pending connection requests
            </p>
          ) : (
            <div className="space-y-3">
              {requests.map((user) => (
                <div
                  key={`request-${user.username}`}
                  className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/20 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="md" />
                    <div>
                      <p className="text-sm text-gray-400">@{user.username}</p>
                      <p className="text-gray-100">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 min-w-[120px]">
                    <button
                      onClick={() => handleAcceptRequest(user.username)}
                      className="px-3 py-1.5 bg-green-600/90 hover:bg-green-500 text-white rounded-lg text-sm flex-1 transition-all shadow hover:shadow-green-500/20"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(user.username)}
                      className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg text-sm flex-1 transition-all shadow hover:shadow-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Explore Users Section */}
        <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">Explore Users</h2>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={`user-${user.username}`}
                className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/20 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} size="md" />
                  <div>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                    <p className="text-gray-100">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
                {user.status === "PENDING" ? (
                  <button
                    onClick={() => handleCancelRequest(user.username)}
                    className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg text-sm w-32 transition-all shadow hover:shadow-red-500/20"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user.username)}
                    className="px-3 py-1.5 bg-blue-600/90 hover:bg-blue-500 text-white rounded-lg text-sm w-32 transition-all shadow hover:shadow-blue-500/20"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-3 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        <button
          onClick={handleConnectionsClick}
          className="flex-1 text-center text-gray-400 hover:text-white py-2 transition-all"
        >
          Connections
        </button>
        <button className="flex-1 text-center text-white font-bold py-2 bg-blue-600/90 rounded-lg mx-2">
          Explore
        </button>
      </div>
    </div>
  );
}