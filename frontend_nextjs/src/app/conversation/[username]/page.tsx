"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getConversation, sendMessage } from "@/lib/api/messageApi";
import { fetchOwnProfile } from "@/lib/api/api";
import { useParams } from "next/navigation"; // Add this import

interface Message {
  id: number;
  text: string;
  senderUsername: string;
  receiverUsername: string;
  createdAt: string;
}

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [ownUsername, setOwnUsername] = useState("");
  const router = useRouter();
  const params = useParams(); // Get params this way
  const username = params.username as string; // Type assertion

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadConversation = async () => {
      try {
        const [conversation, profile] = await Promise.all([
          getConversation(username), // Use the extracted username
          fetchOwnProfile(),
        ]);
        
        setMessages(conversation);
        if (profile) setOwnUsername(profile.username);
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    };

    loadConversation();
  }, [username, router]); // Use username in dependencies

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage(username, newMessage); // Use the extracted username
      setNewMessage("");
      // Refresh conversation after sending
      const conversation = await getConversation(username);
      setMessages(conversation);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // ... rest of your component remains the same
  const handleBackClick = () => {
    router.push("/connection");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <button onClick={handleBackClick} className="text-gray-400 hover:text-white">
          ← Back
        </button>
        <h1 className="text-xl font-bold">@{params.username}</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderUsername === ownUsername ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${message.senderUsername === ownUsername ? "bg-blue-500" : "bg-gray-700"}`}
            >
              <p>{message.text}</p>
              <p className="text-xs text-gray-300 mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white p-2 rounded focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}