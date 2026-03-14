import React, { useState, useEffect, useRef } from 'react';

const ChatArea = ({ messages, activeChannel, onSendMessage, currentUser }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll logic: Naya message aate hi scroll down karega
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Parent component function ko call kar rahe hain
    onSendMessage(inputValue);
    setInputValue(''); // Input box clear karne ke liye
  };

  return (
    <div className="relative z-10 flex flex-col flex-1 h-full bg-[#050505]/60 backdrop-blur-sm">
      
      {/* --- Chat Header --- */}
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a] bg-[#050505]/90">
        <div className="flex items-center space-x-2">
          <span className="text-[#00ffcc] font-bold tracking-widest">
            #{activeChannel}
          </span>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-widest">
          {messages.length} packets received
        </div>
      </div>

      {/* --- Message Feed --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-600 italic text-sm">
            &gt; No transmission history in #{activeChannel}. Start typing...
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="group flex flex-col animate-fadeIn">
              <div className="flex items-baseline space-x-2 mb-1">
                <span className={`font-semibold ${
                  msg.user === currentUser ? 'text-[#bf00ff]' : 
                  msg.user === 'system' ? 'text-gray-500' : 'text-[#00ffcc]'
                }`}>
                  {msg.user === 'system' ? 'root' : `~/${msg.user}`}
                </span>
                <span className="text-[10px] text-gray-600">[{msg.time}]</span>
              </div>
              <div className={`pl-4 border-l-2 py-1 transition-all ${
                msg.user === currentUser ? 'border-[#bf00ff]/50 text-white' : 
                msg.user === 'system' ? 'border-gray-800 text-gray-500 italic' : 
                'border-[#00ffcc]/50 text-gray-200'
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {/* Invisible div auto-scroll ke liye */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Input Area --- */}
      <div className="p-4 bg-gradient-to-t from-[#050505] to-transparent">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex items-center w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded focus-within:border-[#00ffcc] focus-within:shadow-[0_0_15px_rgba(0,255,204,0.1)] transition-all duration-300"
        >
          <span className="pl-4 text-[#00ffcc] font-bold">&gt;</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Execute command in #${activeChannel}...`}
            className="flex-1 bg-transparent border-none outline-none text-white p-3 font-mono placeholder-gray-700"
            autoFocus
          />
          <button 
            type="submit" 
            className="pr-4 text-gray-500 hover:text-[#bf00ff] transition-colors font-bold uppercase text-sm tracking-widest"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatArea;