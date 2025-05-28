"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="bg-gray-800/0 p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-center text-white">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">ChatApp</span>
        </h1>
        <p className="text-gray-400 text-center mb-6 font-light">
          Connect with friends and colleagues in real-time
        </p>

        <div className="space-y-4">
          <div className="bg-gray-700/10 p-5 rounded-xl border border-gray-600/50 hover:border-blue-500/30 transition-all duration-300">
            <h2 className="text-lg font-semibold text-white mb-2">New to ChatApp?</h2>
            <p className="text-gray-300 text-sm mb-4 font-light">
              Create an account to start chatting with your connections
            </p>
            <button
              onClick={() => router.push("/register")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Register Now
            </button>
          </div>

          <div className="bg-gray-700/10 p-5 rounded-xl border border-gray-600/50 hover:border-gray-500/30 transition-all duration-300">
            <h2 className="text-lg font-semibold text-white mb-2">Already have an account?</h2>
            <p className="text-gray-300 text-sm mb-4 font-light">
              Welcome back! Log in to continue your conversations
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gray-600/80 text-white py-2.5 rounded-lg hover:bg-gray-500/80 transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-gray-500/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs font-light">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}