"use client";
import { useState } from "react";
import { MessageCircle, Plus, Menu, X, Send, Bot, User } from "lucide-react";

export default function ChatbotInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState("1");
  const [message, setMessage] = useState("");

  // Dummy chat histories
  const [chatHistories] = useState([
    {
      id: "1",
      title: "Getting Started",
      lastMessage: "How can I help you today?",
      timestamp: "2 min ago",
    },
    {
      id: "2",
      title: "React Questions",
      lastMessage: "Here's how to use useState...",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      title: "API Integration",
      lastMessage: "You can use fetch() to make requests",
      timestamp: "3 hours ago",
    },
    {
      id: "4",
      title: "Styling Help",
      lastMessage: "Tailwind CSS is great for styling",
      timestamp: "1 day ago",
    },
    {
      id: "5",
      title: "Debugging Tips",
      lastMessage: "Try using console.log to debug",
      timestamp: "2 days ago",
    },
  ]);

  // Dummy current chat messages
  const [currentMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      type: "user",
      content: "Can you help me with React components?",
      timestamp: "10:31 AM",
    },
    {
      id: 3,
      type: "bot",
      content:
        "Absolutely! React components are the building blocks of React applications. They let you split the UI into independent, reusable pieces. Would you like me to explain functional components or class components?",
      timestamp: "10:31 AM",
    },
  ]);

  const handleNewChat = () => {
    const newChatId = (chatHistories.length + 1).toString();
    setCurrentChatId(newChatId);
    // In a real app, you'd create a new chat here
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, you'd add the message to the current chat
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-gray-800 flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="/logo.png"
              alt="Chatbot Logo"
              className="w-8 h-8 rounded-lg bg-blue-600 p-1"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"
              style={{ display: "none" }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">
            Recent Chats
          </h2>
          <div className="space-y-2">
            {chatHistories.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-700 ${
                  currentChatId === chat.id ? "bg-gray-700" : ""
                }`}
              >
                <div className="flex items-start space-x-2">
                  <MessageCircle className="w-4 h-4 mt-1 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.timestamp}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <h2 className="text-lg font-semibold">Chat Assistant</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex space-x-3 max-w-3xl ${
                  msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.type === "user" ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  {msg.type === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="1"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
