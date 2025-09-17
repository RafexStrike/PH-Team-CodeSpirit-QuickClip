'use client';

import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatComposer from "@/components/chat/ChatComposer";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await res.json();

      const botResponse = {
        id: messages.length + 2,
        content: data.reply || "No response",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          content: "Error contacting AI: " + err.message,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-base-100">
      <ChatSidebar conversations={[]} activeConversation={1} onConversationSelect={() => {}} onNewChat={() => {}} />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={messages} />
        <ChatComposer
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
