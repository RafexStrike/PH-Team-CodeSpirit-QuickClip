'use client';
import { User, Bot } from 'lucide-react';

export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto bg-base-100">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-6 border-b border-base-200 ${
              message.sender === 'user' ? 'bg-base-50' : 'bg-base-100'
            }`}
          >
            <div className="flex gap-4 max-w-none">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-content'
                      : 'bg-secondary text-secondary-content'
                  }`}
                >
                  {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">
                    {message.sender === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <span className="text-xs text-base-content/60">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none text-base-content">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
