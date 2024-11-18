import { SendHorizontal } from 'lucide-react';
import { useState } from 'react';

export function ChatBox() {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-3xl p-6 shadow-lg">
      <div className="flex-1 overflow-auto mb-4">
        <div className="space-y-4">
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200">
              Hello! How can I assist you today?
            </div>
          </div>
          <div className="chat chat-end">
            <div className="chat-bubble bg-primary text-primary-content">
              Can you help me with some code?
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="input input-bordered flex-1 focus:outline-none focus:border-primary"
        />
        <button className="btn btn-primary btn-circle">
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}