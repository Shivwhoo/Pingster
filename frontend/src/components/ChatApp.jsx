import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const ChatApp = ({ currentUser }) => {
  // --- GLOBAL STATE ---
  const [messages, setMessages] = useState([
    // Dummy messages taaki screen khali na lage
    { user: 'system', text: `Authentication successful. Welcome, ${currentUser}.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { user: 'dev_guy', text: 'Has anyone seen the latest build logs?', time: '10:01 PM' }
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');

  // --- REAL-TIME LOGIC PLACEHOLDER ---
  useEffect(() => {
    // Baad me yahan Socket.io ka connection aayega
    setIsConnected(true); 

    return () => {
      // Cleanup code
    };
  }, []);

  const handleSendMessage = (text) => {
    // Abhi ke liye local state me update kar rahe hain
    // Baad me isko socket.emit() se replace karenge
    const newMessage = {
      user: currentUser,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="relative flex h-screen w-full bg-[#050505] text-[#e0e0e0] font-mono overflow-hidden">
      
      {/* Background Grid */}
      <style dangerouslySetInnerHTML={{__html: `
        .bg-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(0, 255, 204, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 204, 0.03) 1px, transparent 1px);
          animation: pan 30s linear infinite;
        }
        @keyframes pan {
          0% { background-position: 0px 0px; }
          100% { background-position: 50px 50px; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00ffcc; }
      `}} />
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none"></div>

      {/* --- CHILD COMPONENTS --- */}
      <Sidebar 
        isConnected={isConnected} 
        activeChannel={activeChannel} 
        setActiveChannel={setActiveChannel} 
      />
      
      <ChatArea 
        messages={messages} 
        activeChannel={activeChannel} 
        onSendMessage={handleSendMessage} 
        currentUser={currentUser}
      />

    </div>
  );
};

export default ChatApp;