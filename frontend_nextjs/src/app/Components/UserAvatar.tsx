"use client";

import Image from "next/image";

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
}

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  if (user.photo) {
    return (
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
        <Image
          src={user.photo}
          alt={`${user.firstName} ${user.lastName || ""}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => console.error(`Failed to load image for ${user.username}: ${user.photo}`)}
        />
      </div>
    );
  }

  const colorIndex = user.firstName.charCodeAt(0) % colors.length;
  const initials = `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`;

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-medium ${textClasses[size]}`}
    >
      {initials}
    </div>
  );
}