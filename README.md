# 💬 ChatApp — Real-Time Messaging App with WebSockets 🚀

Welcome to **ChatApp**, a full-stack real-time messaging platform built with ❤️ using **Next.js**, **Express**, **Prisma**, **PostgreSQL**, and **WebSockets** powered by **Socket.IO**!

> Instantly connect, chat, and share — all in real-time. No refresh required.

## ✨ Features

- **⚡ Real-time messaging** using Socket.io
- **🔒 Secure authentication** with JWT and Google OAuth
- **🎨 Modern UI** built with Next.js and Tailwind CSS
- **💾 Persistent storage** with PostgreSQL and Prisma ORM
- **🌐 Type-safe** end-to-end using TypeScript
- **📱 Responsive design** for desktop and mobile devices

## ⚡ Real-Time Chat with Socket.IO

This app leverages **WebSocket technology via Socket.IO** to enable **real-time communication** between users.

No reloads. No delays. Just pure, instant chatting. As soon as someone sends a message — it pops up *instantly* in the conversation 🎉

## 🔐 Authentication

* 🔐 **Sign up & Login with Email/Password**
* 🌐 **Google OAuth2 Authentication** (via Passport.js)
* 🪙 **JWT-based API & socket protection**

You stay logged in — securely — with token-based authentication.

## 📸 UI Highlights

* 🔍 **Explore users** and send connection requests
* 🤝 **Accept / Cancel / Delete** connections easily
* 💬 **Start a chat** with any accepted connection
* 👤 View your profile in the navbar
* ⋮ Log out via a smooth dropdown menu

## 🏗️ Tech Stack

### 🔧 Backend
- **Express.js**: Fast, unopinionated web framework for Node.js
- **Socket.io**: Real-time bidirectional event-based communication
- **PostgreSQL**: Powerful open-source relational database
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **TypeScript**: Strongly typed programming language
- **JWT & Passport**: Authentication and authorization
- **bcryptjs**: Password hashing

### 🖼️ Frontend
- **Next.js 15**: React framework with server-side rendering
- **React 19**: JavaScript library for building user interfaces
- **Socket.io-client**: Client library for Socket.io
- **Tailwind CSS 4**: Utility-first CSS framework
- **Axios**: Promise-based HTTP client

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v13 or later)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatapp.git
   cd chatapp
   ```

2. **Backend Setup**
   ```bash
   cd backend_expressjs
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string and JWT secret
   
   # Run database migrations
   npx prisma migrate dev
   
   # Start the development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend_nextjs
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your backend API URL
   
   # Start the development server
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/chatapp"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
PORT=8000
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:8000"
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `GET /api/auth/google` - Google OAuth authentication
- `GET /api/auth/google/callback` - Google OAuth callback

### Chat Endpoints
- `GET /api/chats` - Get all chats for a user
- `POST /api/chats` - Create a new chat
- `GET /api/chats/:id` - Get chat by ID
- `GET /api/chats/:id/messages` - Get messages for a chat
- `POST /api/chats/:id/messages` - Send a new message

## 🔌 Socket.io Events

### Client Events

- `register` - Register user with their username
- `send_message` - Send a direct message to another user
- `disconnect_connection` - User disconnects from socket

### Server Events

- `receive_message` - Receive a new message


## 📂 Project Structure

```
chatapp/
├── backend_expressjs/
└── frontend_nextjs/
```

## 🤝 Contributing

Got an idea to make it even better? Fork it, code it, and create a PR — contributions are **always welcome**!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🖋️ Author

**Sardaar Niamotullah**

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [Next.js](https://nextjs.org/)
- [Socket.io](https://socket.io/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)