"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getConversation } from "@/lib/api/messageApi";
import { fetchOwnProfile, fetchUserProfile } from "@/lib/api/api";
import {
  connectSocket,
  disconnectSocket,
  onReceiveMessage,
  offReceiveMessage,
  sendMessageSocket,
} from "@/lib/socket/messageSocket";
import UserAvatar from "@/app/Components/UserAvatar";

interface Message {
  id: string;
  text: string;
  senderUsername: string;
  receiverUsername: string;
  createdAt: string;
}

interface User {
  username: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
}

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [ownUsername, setOwnUsername] = useState("");
  const [conversedUser, setConversedUser] = useState<User | null>(null);
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const hasRefreshed = useRef(false);

  // useEffect(() => {
  //   if (!hasRefreshed.current) {
  //     const timer = setTimeout(() => {
  //       router.refresh();
  //       hasRefreshed.current = true;
  //     }, 1000);

  //     console.log("I'm just got refreshed!");
  //     return () => clearTimeout(timer);
  //   }
  // }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [conversation, ownProfile, conversedProfile] = await Promise.all([
          getConversation(username),
          fetchOwnProfile(),
          fetchUserProfile(username),
        ]);

        console.log("Conversation data:", conversation);
        console.log("Own profile:", ownProfile);
        console.log("Conversed user profile:", conversedProfile);

        setMessages(conversation);
        setOwnUsername(ownProfile.username);
        setConversedUser(conversedProfile);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadData();

    return () => {
      offReceiveMessage();
      disconnectSocket();
    };
  }, [username, router]);

  useEffect(() => {
    if (!ownUsername) return;

    console.log(`Setting up WebSocket for ${ownUsername}`);
    connectSocket(ownUsername);

    onReceiveMessage((message) => {
      console.log("Processing message:", message);
      const isCurrentConversation =
        (message.senderUsername === ownUsername && message.receiverUsername === username) ||
        (message.senderUsername === username && message.receiverUsername === ownUsername);

      if (!isCurrentConversation) {
        console.log("Ignoring message: not for current conversation");
        return;
      }

      setMessages((prev) => {
        const tempIndex = prev.findIndex(
          (m) =>
            m.id.startsWith("-") &&
            m.text === message.text &&
            m.senderUsername === message.senderUsername &&
            m.receiverUsername === message.receiverUsername
        );

        if (tempIndex !== -1) {
          console.log("Replacing optimistic message at index:", tempIndex);
          const updated = [...prev];
          updated[tempIndex] = message;
          return updated;
        }

        const exists = prev.find((msg) => msg.id === message.id);
        if (exists) {
          console.log("Message already exists, skipping:", message.id);
          return prev;
        }

        console.log("Adding new message:", message);
        return [...prev, message];
      });
    });

    const refreshMessages = async () => {
      try {
        const conversation = await getConversation(username);
        console.log("Refreshed conversation:", conversation);
        setMessages((prev) => {
          const newMessages = conversation.filter(
            (msg: Message) => !prev.some((m) => m.id === msg.id)
          );
          if (newMessages.length > 0) {
            console.log("Adding new messages:", newMessages);
          }
          return [...prev, ...newMessages];
        });
      } catch (err) {
        console.error("Error refreshing messages:", err);
      }
    };

    refreshMessages();

    return () => {
      console.log(`Cleaning up WebSocket for ${ownUsername}`);
      offReceiveMessage();
      disconnectSocket();
    };
  }, [ownUsername, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const optimisticMessage: Message = {
      id: `-${Date.now()}`,
      text: newMessage,
      senderUsername: ownUsername,
      receiverUsername: username,
      createdAt: new Date().toISOString(),
    };

    console.log("Sending optimistic message:", optimisticMessage);
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    sendMessageSocket(ownUsername, username, newMessage);
  };

  const handleBackClick = () => {
    router.push("/connection");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="flex justify-between items-center p-4 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        <button
          onClick={handleBackClick}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Connections
        </button>
        <div className="flex items-center gap-3">
          {conversedUser ? (
            <>
              <UserAvatar user={conversedUser} size="sm" />
              <div className="text-right">
                <h1 className="font-medium">@{params.username}</h1>
                <p className="text-xs text-gray-400">
                  {conversedUser.firstName} {conversedUser.lastName}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-700/50 animate-pulse" />
              <h1 className="font-medium">@{params.username}</h1>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-900/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderUsername === ownUsername
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-4 rounded-2xl ${
                message.senderUsername === ownUsername
                  ? "bg-blue-700/80 rounded-tr-none"
                  : "bg-green-700/80 rounded-tl-none"
              } shadow-lg`}
            >
              <p className="text-gray-100">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.senderUsername === ownUsername
                    ? "text-gray-400/90"
                    : "text-gray-400"
                }`}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700/50 text-white p-3 rounded-lg border border-gray-600/30 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="white"
              viewBox="0 0 256 256"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M225.39844,110.5498,56.4834,15.957A20,20,0,0,0,27.877,40.13477L59.25781,128,27.877,215.86621A19.97134,19.97134,0,0,0,56.48437,240.042L225.39844,145.4502a19.99958,19.99958,0,0,0,0-34.9004ZM54.06738,213.88867,80.45605,140H136a12,12,0,0,0,0-24H80.45654L54.06738,42.11133,207.44043,128Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}