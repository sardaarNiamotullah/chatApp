"use client";

import { useEffect, useState } from "react";
import { fetchAcceptedConnections, fetchOwnProfile } from "@/lib/api/api";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  firstName: string;
  lastName: string;
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<User[]>([]);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const loadData = async () => {
    try {
      const [connectionsData, ownUser]: [User[], User | null] =
        await Promise.all([fetchAcceptedConnections(), fetchOwnProfile()]);

      setConnections(connectionsData);
      if (ownUser) setOwnUsername(ownUser.username);
    } catch (err) {
      console.error("Error loading connections:", err);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    // If token is present in the URL (after Google login), save to localStorage
    if (urlToken) {
      localStorage.setItem("token", urlToken);

      // Remove token from URL (clean URL)
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

      {/* Connections List */}
      <div className="flex-1 overflow-auto p-4">
        {connections.length > 0 ? (
          connections.map((user) => (
            <button
              key={`connection-${user.username}`}
              onClick={() => handleConnectionClick(user.username)}
              className="w-full text-left flex justify-between items-center border-b border-gray-700 p-3 hover:bg-gray-800 transition-colors"
            >
              <div>
                <p className="text-sm text-gray-400">@{user.username}</p>
                <p className="text-lg">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-gray-400 mb-4 text-center">
              Oh no, you do not have any connections or friends to talk to.
            </p>
            <button
              onClick={handleUsersClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Explore Users
            </button>
          </div>
        )}
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
          Explore Users
        </button>
      </div>
    </div>
  );
}
