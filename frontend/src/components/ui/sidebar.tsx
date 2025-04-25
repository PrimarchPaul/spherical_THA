import React, { useState, useRef, useEffect } from 'react';
import {
  ChatMessage,
  getOpenAiResponse,
  savePin,
  deletePin,
} from '../../services/index';

interface SidebarProps {
  sessionId: string;
  coords: [number, number];
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessionId, coords, onClose }) => {
  const [pinName, setPinName] = useState('');
  const [pinDescription, setPinDescription] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [pointerId, setPointerId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const handleDelete = async () => {
    if (!pointerId) return;
    try {
      await deletePin(sessionId, pointerId);
      onClose();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const handleSave = async () => {
    try {
      const id = await savePin({
        sessionId,
        latitude: coords[1],
        longitude: coords[0],
        pinName,
        pinDescription,
      });
      setPointerId(id);
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text: chatInput };
    setMessages((msgs) => [...msgs, userMsg]);
    try {
      const botMsg = await getOpenAiResponse(chatInput, coords[1], coords[0]);
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (e) {
      console.error('Chat failed', e);
    }
    setChatInput('');
  };

  const handleClose = () => {
    setPinName('');
    setPinDescription('');
    setMessages([]);
    setChatInput('');
    setPointerId(undefined);
    onClose();
  };

  return (
    <aside className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg p-4 flex flex-col">
      <input
        type="text"
        placeholder="Point Name"
        value={pinName}
        onChange={(e) => setPinName(e.target.value)}
        className="border rounded p-2 mb-2"
      />

      <textarea
        placeholder="Point Description"
        value={pinDescription}
        onChange={(e) => setPinDescription(e.target.value)}
        className="border rounded p-2 mb-2 h-24 resize-none"
      />


      <div ref={scrollRef} className="flex-1 border rounded p-2 mb-2 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.sender === 'assistant' ? 'italic' : 'font-bold'}>
              {msg.sender === 'user' ? 'You:' : 'Bot:'}
            </span>{' '}
            {msg.text}
          </div>
        ))}
      </div>

    
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Ask something..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 border rounded-l p-2"
        />
        <button
          onClick={handleChatSend}
          className="px-4 rounded-r bg-blue-600 text-white"
        >
          Send
        </button>
      </div>

     
      <div className="flex justify-between">
        <button
          onClick={handleDelete}
          disabled={!pointerId}
          className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete
        </button>
        <button
          onClick={handleSave}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={handleChatSend}
          className="px-2 py-1 bg-indigo-500 text-white rounded"
        >
          Chat
        </button>
        <button
          onClick={handleClose}
          className="px-2 py-1 bg-gray-400 text-white rounded"
        >
          X
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
