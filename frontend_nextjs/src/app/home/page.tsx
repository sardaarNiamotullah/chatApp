"use client";

import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/api"; // Import fetchUsers
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }
    fetchUsers().then(setUsers).catch(console.error);
  }, [router]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">ChatApp</h1>
        <button className="text-xl">⋮</button>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-auto p-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="border-b border-gray-700 p-3">
              <p className="text-sm text-gray-400">@{user.username}</p>
              <p className="text-lg">
                {user.firstName} {user.lastName}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No users found</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center p-4 border-t border-gray-700 bg-black">
        <button className="flex-1 text-center text-white font-bold">
          Users
        </button>
        <button className="flex-1 text-center text-gray-400">Friends</button>
      </div>
    </div>
  );
}
