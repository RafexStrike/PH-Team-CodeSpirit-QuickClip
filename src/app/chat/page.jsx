"use client";

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

  // caution starts : trying to send the data to the api to save to mongodb
  const saveChatDataToDatabase = async (data) => {
    try {
      const dataToSend = await fetch("/api/getAndPostChatData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.log(
        "Sorry. Failed to connect with mongodb. The error is: ",
        error
      );
    }
  };
  // caution ends

  // normal text message send
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const newUserMessage = {
      id: Date.now(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    // caution starts : trying to send the data to the api to save to mongodb
    saveChatDataToDatabase(newUserMessage);
    // caution ends
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await res.json();
      // caution starts : trying to send the data to the api to save to mongodb
      const newBotMessage = {
        id: Date.now() + 1,
        content: data.reply || "No response",
        sender: "bot",
        timestamp: new Date(),
      };
      saveChatDataToDatabase(newBotMessage);
      // caution ends
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "Error contacting AI: " + err.message,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-base-100">
      <ChatSidebar
        conversations={[]}
        activeConversation={1}
        onConversationSelect={() => {}}
        onNewChat={() => {}}
      />
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
