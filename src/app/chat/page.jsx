// 'use client';

// import { useState } from "react";
// import ChatSidebar from "@/components/chat/ChatSidebar";
// import ChatWindow from "@/components/chat/ChatWindow";
// import ChatComposer from "@/components/chat/ChatComposer";

// export default function ChatPage() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       content: "Hello! How can I help you today?",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");

//   const handleSendMessage = async (message) => {
//     if (!message.trim()) return;

//     const newMessage = {
//       id: messages.length + 1,
//       content: message,
//       sender: "user",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, newMessage]);
//     setInputValue("");

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: message }),
//       });
//       const data = await res.json();

//       const botResponse = {
//         id: messages.length + 2,
//         content: data.reply || "No response",
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botResponse]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: messages.length + 2,
//           content: "Error contacting AI: " + err.message,
//           sender: "bot",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-base-100">
//       <ChatSidebar conversations={[]} activeConversation={1} onConversationSelect={() => {}} onNewChat={() => {}} />
//       <div className="flex flex-col flex-1">
//         <ChatWindow messages={messages} />
//         <ChatComposer
//           inputValue={inputValue}
//           onInputChange={setInputValue}
//           onSendMessage={handleSendMessage}
//         />
//       </div>
//     </div>
//   );
// }
// src/app/chat/page.jsx
"use client";

import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatComposer from "@/components/chat/ChatComposer";
import UploadButton from "@/components/chat/UploadButton";
import UploadModal from "@/components/chat/UploadModal";
import { uploadVideoAndSummarize } from "@/lib/uploadVideo";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // normal text message send
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
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
        id: Date.now() + 1,
        content: data.reply || "No response",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
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

  // when a file is uploaded from modal
  const handleVideoUpload = async (file) => {
    console.log("handleVideoUpload called with file:", file);
    const data = await uploadVideoAndSummarize(file);
    console.log("Upload result:", data);

    if (data.summary) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: `Summary: ${data.summary}`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } else if (data.error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: `Error: ${data.error}`,
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
        {/* Upload button at the top */}
        <div className="flex justify-end p-4">
          <UploadButton
            onClick={() => {
              console.log("Upload button clicked");
              setIsModalOpen(true);
            }}
          />
        </div>

        <ChatWindow messages={messages} />

        <ChatComposer
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
        />
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleVideoUpload}
      />
    </div>
  );
}
