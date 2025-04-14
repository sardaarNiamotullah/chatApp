"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getConversation } from "@/lib/api/messageApi";
import { fetchOwnProfile } from "@/lib/api/api";
import {
  connectSocket,
  disconnectSocket,
  onReceiveMessage,
  offReceiveMessage,
  sendMessageSocket,
} from "@/lib/socket/messageSocket";

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
  const params = useParams();
  const username = params.username as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      const [conversation, profile] = await Promise.all([
        getConversation(username),
        fetchOwnProfile(),
      ]);

      setMessages(conversation);
      setOwnUsername(profile.username);

      // 🔌 Connect and register
      connectSocket(profile.username);

      // 📥 Listen for real-time messages
      onReceiveMessage(username, profile.username, (message) => {
        setMessages((prev) => {
          const exists = prev.find((msg) => msg.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
      });
    };

    loadData();

    return () => {
      offReceiveMessage();
      disconnectSocket();
    };
  }, [username, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const optimisticMessage: Message = {
      id: Date.now(),
      text: newMessage,
      senderUsername: ownUsername,
      receiverUsername: username,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    sendMessageSocket(ownUsername, username, newMessage);
  };

  const handleBackClick = () => {
    router.push("/connection");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <button onClick={handleBackClick} className="text-gray-400 hover:text-white">
          ← Back
        </button>
        <h1 className="text-xl font-bold">@{params.username}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderUsername === ownUsername ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.senderUsername === ownUsername ? "bg-blue-500" : "bg-gray-700"
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs text-gray-300 mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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
