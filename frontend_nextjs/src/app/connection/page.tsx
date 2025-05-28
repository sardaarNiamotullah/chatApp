"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchAcceptedConnections, fetchOwnProfile } from "@/lib/api/api";
import UserAvatar from "@/app/Components/UserAvatar";

interface User {
  username: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const loadData = async () => {
    try {
      const [connectionsData, ownUser] = await Promise.all([
        fetchAcceptedConnections(),
        fetchOwnProfile(),
      ]);

      setConnections(connectionsData);
      if (ownUser) setCurrentUser(ownUser);
    } catch (err) {
      console.error("Error loading connections:", err);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, "/connection");
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router]);

  const handleUsersClick = () => {
    router.push("/explore");
  };

  const handleConnectionClick = (username: string) => {
    router.push(`/conversation/${username}`);
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

      {/* Connections List */}
      <div className="flex-1 overflow-auto p-4">
        {connections.length > 0 ? (
          <div className="space-y-3">
            {connections.map((user) => (
              <button
                key={`connection-${user.username}`}
                onClick={() => handleConnectionClick(user.username)}
                className="w-full text-left flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/20 hover:border-blue-500/30 hover:bg-gray-700/50 transition-all"
              >
                <UserAvatar user={user} size="md" />
                <div className="text-left">
                  <p className="text-sm text-gray-400">@{user.username}</p>
                  <p className="text-gray-100 font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-8 max-w-md w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-200 mb-2">No connections yet</h3>
              <p className="text-gray-400 mb-6">
                Start building your network by exploring users
              </p>
              <button
                onClick={handleUsersClick}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Explore Users
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-3 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        <button className="flex-1 text-center text-white font-bold py-2 bg-blue-600/90 rounded-lg mx-2">
          Connections
        </button>
        <button
          onClick={handleUsersClick}
          className="flex-1 text-center text-gray-400 hover:text-white py-2 transition-all"
        >
          Explore Users
        </button>
      </div>
    </div>
  );
}