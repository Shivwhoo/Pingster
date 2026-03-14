import React from 'react';

const Sidebar = ({ isConnected, activeChannel, setActiveChannel }) => {
  // Yeh aapke server se aane wale real channels honge baad me
  const channels = ['general', 'random', 'build-logs', 'alerts'];

  return (
    <div className="relative z-10 hidden md:flex flex-col w-64 border-r border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-sm h-full">
      
      {/* --- App Header --- */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <h1 className="text-[#00ffcc] text-lg font-bold tracking-widest drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] truncate">
          &gt; NEXUS_CHAT
        </h1>
      </div>

      {/* --- Channels List --- */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider font-bold">
          Active Channels
        </p>
        <ul className="space-y-2">
          {channels.map((channel) => (
            <li
              key={channel}
              onClick={() => setActiveChannel(channel)}
              className={`px-3 py-2 rounded cursor-pointer transition-all duration-200 flex items-center ${
                activeChannel === channel
                  ? 'text-[#00ffcc] bg-[#00ffcc]/10 border-l-2 border-[#00ffcc]' // Active State
                  : 'text-gray-400 border-l-2 border-transparent hover:text-white hover:bg-white/5 hover:border-gray-500' // Inactive State
              }`}
            >
              <span className="mr-2 opacity-50">#</span> {channel}
            </li>
          ))}
        </ul>
      </div>

      {/* --- Connection Status Footer --- */}
      <div className="p-4 border-t border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center text-xs">
          <span 
            className={`inline-block w-2 h-2 rounded-full mr-2 ${
              isConnected 
                ? 'bg-[#bf00ff] animate-pulse shadow-[0_0_5px_#bf00ff]' 
                : 'bg-red-500 shadow-[0_0_5px_red]'
            }`}
          ></span>
          <span className={isConnected ? 'text-[#bf00ff]' : 'text-red-500 font-bold'}>
            {isConnected ? 'SYS.ONLINE' : 'SYS.OFFLINE'}
          </span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;