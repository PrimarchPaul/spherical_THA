import React, { useState, useRef, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import './sidebar.css';

import {
  savePin,
  Pin,
  updatePin
} from '../../../services/api/pins';

import { 
  getOpenAiResponse, 
  ChatMessage 
} from '../../../services/api/openai';
import { on } from 'events';

interface SidebarProps {
  sessionId: string;
  coords: [number, number];
  existingPin?: Pin;
  onClose: () => void;
  onSave: (newPin: Pin) => void;
}

const NAME_LIMIT = 50;

const Sidebar: React.FC<SidebarProps> = ({ sessionId, coords, existingPin, onClose, onSave}) => {

  const [pinName, setPinName] = useState('');
  const [pinDescription, setPinDescription] = useState(existingPin?.pinDescription || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isNew = !existingPin;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (existingPin) {
      setPinName(existingPin.pinName);
      setPinDescription(existingPin.pinDescription ?? '');
    } else {
      setPinName('');
      setPinDescription('');
    }
  }, [existingPin]);

  const handleSave = async () => {

    if(!pinName){
      alert("Pin name is required");
      return;
    }
    
    const pinObj: Pin = {
      id: isNew ? uuidv4() : existingPin!.id,
      sessionId,
      longitude: coords[0],
      latitude: coords[1],
      pinName,
      pinDescription,
    };
    
    try {
      if (isNew) {
      const savedId = await savePin(pinObj);
      pinObj.id = savedId || pinObj.id;
      onSave(pinObj);
      }else{
        await updatePin(pinObj);
        onSave(pinObj);
      }
      
      onClose();
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = { sender: 'user', text: chatInput };
    setMessages((msgs) => [...msgs, userMsg]);

    try {

      const raw = await getOpenAiResponse(chatInput, coords[1], coords[0]);

      if (!raw) {
        throw new Error('No response from OpenAI');
      }
      
      let assistantText: string;

      if (typeof raw === 'string') {
        assistantText = raw;
      } else if ('text' in raw && typeof raw.text === 'string') {
        assistantText = raw.text;
      } else if ('information' in raw && typeof raw.information === 'string') {
        
        let info = raw.information
          .replace(/```json\s*/, '')
          .replace(/```$/, '');
        try {
          const obj = JSON.parse(info);
          assistantText = `${obj.response}`;
        } catch {
          assistantText = info;
        }

      }else if ('choices' in raw && Array.isArray((raw as any).choices) && (raw as any).choices[0]?.message?.content) {
        assistantText = (raw as any).choices[0].message.content;
      } else {
        assistantText = JSON.stringify(raw, null, 2);
      }

      const botMsg: ChatMessage = { sender: 'assistant', text: assistantText };
      setMessages((msgs) => [...msgs, botMsg]);

    } catch (e) {
      console.error('Chat failed', e);
    }
    setChatInput('');
  };



  return (
    <aside className="sidebar">
      <div className="pin-input-group">
        <input
          type="text"
          value={pinName}
          maxLength={NAME_LIMIT}
          onChange={(e) => setPinName(e.target.value)}
          className="pin-name-input"
        />
        <div className="char-count">
          {pinName.length}/50
        </div>
      </div>

      <textarea
        placeholder="Point Description"
        value={pinDescription}
        onChange={(e) => setPinDescription(e.target.value)}
        className="pin-desc-textarea"
      />


      <div ref={scrollRef} className="chat-window">
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={msg.sender === 'user' ? 'user-message' : 'bot-message'}
          >
            <span className={"chat-sender"}>
              {msg.sender === 'user' ? 'You:' : 'Bot:'}
            </span>{' '}
            {msg.text}
          </div>
        ))}
      </div>

    
      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Ask something..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="chat-input"
        />
        <button
          onClick={handleChatSend}
          className="send-button"
        >
          Send
        </button>
      </div>

      <div className="action-buttons">
        <button onClick={handleSave} className="btn-save">
          {isNew ? 'Save' : 'Update'}
        </button>
        <button onClick={onClose} className="btn-cancel">
          Cancel
        </button>
    
      </div>
    </aside>
  );
}

export default Sidebar;
