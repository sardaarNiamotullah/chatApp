"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", content: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // ✅ Store the token after successful registration
      localStorage.setItem("token", data.token);

      setMessage({ type: "success", content: "Registration successful!" });

      // ✅ Redirect to /home after 1 second
      setTimeout(() => router.push("/home"),);
    } catch (err) {
      setMessage({ type: "error", content: (err as Error).message });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Chat App
        </h1>
        {message.content && (
          <p
            className={`text-sm mb-2 text-center ${
              message.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message.content}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="border p-2 rounded w-1/2 placeholder-gray-500 text-black"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-2 rounded w-1/2 placeholder-gray-500 text-black"
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border p-2 rounded placeholder-gray-500 text-black"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded placeholder-gray-500 text-black"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded placeholder-gray-500 text-black"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
