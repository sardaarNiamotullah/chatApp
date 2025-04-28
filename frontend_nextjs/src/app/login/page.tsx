// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     identifier: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:8000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Login failed");
//       }

//       localStorage.setItem("token", data.token);
//       setMessage("Login successful!");
//       setTimeout(() => router.push("/home"), 0);
//     } catch (err) {
//       setMessage((err as Error).message);
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-900">
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-700">
//         <h1 className="text-2xl font-bold mb-4 text-center text-white">
//           ChatApp
//         </h1>
//         {message && (
//           <p
//             className={`text-sm mb-2 text-center ${
//               message === "Login successful!"
//                 ? "text-green-400"
//                 : "text-red-400"
//             }`}
//           >
//             {message}
//           </p>
//         )}
        
//         {/* Google Login Button - Primary Option */}
//         <a
//           href="http://localhost:8000/api/auth/google"
//           className="flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition mb-4"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             fill="currentColor"
//             viewBox="0 0 16 16"
//             className="text-white"
//           >
//             <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
//           </svg>
//           Login with Google
//         </a>

//         {/* Divider */}
//         <div className="flex items-center my-4">
//           <div className="flex-grow border-t border-gray-600"></div>
//           <span className="mx-2 text-gray-400">or</span>
//           <div className="flex-grow border-t border-gray-600"></div>
//         </div>

//         {/* Email Login Form */}
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <input
//             type="text"
//             name="identifier"
//             placeholder="Email or Username"
//             value={formData.identifier}
//             onChange={handleChange}
//             className="bg-gray-700 border border-gray-600 text-white p-2 rounded placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="bg-gray-700 border border-gray-600 text-white p-2 rounded placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             required
//           />
//           <button
//             type="submit"
//             className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-500 transition font-medium"
//           >
//             Login with Email
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setTimeout(() => router.push("/home"), 0);
      // router.push("/home"); // ✅ Immediately navigate after login
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  // After Google redirects back to frontend
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setTimeout(() => router.push("/home"), 0);
      // router.replace("/home"); // ✅ After Google login success
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">
          ChatApp
        </h1>

        {message && (
          <p
            className={`text-sm mb-2 text-center ${
              message === "Login successful!"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition mb-4 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-white"
          >
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
          </svg>
          Login with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Email/Password Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="identifier"
            placeholder="Email or Username"
            value={formData.identifier}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 text-white p-2 rounded placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 text-white p-2 rounded placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-500 transition font-medium"
          >
            Login with Email
          </button>
        </form>
      </div>
    </div>
  );
}
