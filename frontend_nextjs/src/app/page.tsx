"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-black">Welcome to ChatApp</h1>
        <p className="mb-6 text-gray-600">Please register or log in to continue.</p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/register")}
            className="flex-1 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Register
          </button>
          <button
            onClick={() => router.push("/login")}
            className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
