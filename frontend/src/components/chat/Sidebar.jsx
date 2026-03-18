import { Search, LogOut, Loader2, UserPlus, X, Wifi, Plus,Terminal } from "lucide-react";

const Sidebar = ({
  currentUser,
  socketConnected,
  handleLogout,
  searchQuery,
  handleSearch,
  setSearchQuery,
  isSearching,
  searchResults,
  accessChat,
  setIsGroupModalOpen,
  isChatsLoading,
  chats,
  activeChat,
  setActiveChat,
  getChatAvatar,
  getChatName,
  openProfile,
  onlineUsers,
  notifications,
  setNotifications
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#050505] relative z-20 shrink-0 font-mono selection:bg-[#b026ff]/30">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0 mix-blend-screen"></div>

      {/* Profile Header */}
      <div className="p-4 md:p-5 border-b border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-between shrink-0 relative z-10 shadow-sm">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff]/20 to-transparent"></div>
        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-white/[0.03] active:bg-white/[0.05] p-2 -ml-2 rounded-xl transition-all group"
          onClick={openProfile}
          title="Access Node Identity"
        >
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border border-white/10 group-hover:border-[#b026ff]/50 bg-black/50 shrink-0 relative transition-colors shadow-inner">
            <img
              src={
                currentUser?.avatar ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.username || "user"}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 border-[#0a0a0a] ${socketConnected ? "bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.6)]" : "bg-red-500"} z-10 transition-colors`}
            ></div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] md:text-xs font-bold text-white tracking-widest uppercase truncate max-w-[120px] sm:max-w-[160px] md:max-w-[180px] drop-shadow-sm group-hover:text-[#b026ff] transition-colors">
              {currentUser?.username || currentUser?.name || "UNKNOWN_NODE"}
            </span>
            <span className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
              {socketConnected ? (
                <span className="text-[#39ff14]/90 flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 md:w-3 md:h-3 animate-pulse" /> Network_Sync
                </span>
              ) : (
                "Connecting..."
              )}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2.5 md:p-3 text-gray-500 hover:text-red-500 active:text-red-500 bg-white/5 hover:bg-red-500/10 active:bg-red-500/20 rounded-xl transition-all group border border-transparent hover:border-red-500/30"
        >
          <LogOut className="w-4 h-4 md:w-4 md:h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Search Radar */}
      <div className="p-3 md:p-4 border-b border-white/[0.05] relative z-10 bg-[#080808]/80 backdrop-blur-md shrink-0">
        <div className="relative group flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-[#b026ff] transition-colors z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search_Entities..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 md:py-3.5 pl-11 pr-11 text-xs md:text-sm focus:outline-none focus:border-[#b026ff]/50 focus:bg-white/[0.02] focus:ring-4 focus:ring-[#b026ff]/10 transition-all text-white placeholder-gray-600 tracking-wide font-mono shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => {
                handleSearch("");
                setSearchQuery("");
              }}
              className="absolute right-2.5 p-1.5 text-gray-500 hover:text-white bg-black/50 hover:bg-white/10 rounded-lg transition-all border border-white/10 z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chat List / Radar Results */}
      <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-1 custom-scrollbar relative z-10">
        {searchQuery ? (
          <>
            <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-[#b026ff]/10 border border-[#b026ff]/20 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-ping"></span>
              <p className="text-[9px] md:text-[10px] text-[#b026ff] font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(176,38,255,0.5)]">
                Radar_Results
              </p>
            </div>
            
            {isSearching ? (
              <div className="flex justify-center py-10 opacity-60">
                <Loader2 className="w-6 h-6 text-[#b026ff] animate-spin drop-shadow-[0_0_8px_rgba(176,38,255,0.5)]" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-10 opacity-50 flex flex-col items-center">
                 <Terminal className="w-6 h-6 text-gray-600 mb-3" />
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border border-white/10 px-4 py-2 rounded-lg bg-black/50">
                  Target not found.
                </p>
              </div>
            ) : (
              searchResults.map((user) => {
                const isOnline = (onlineUsers || []).some(id => String(id) === String(user._id));

                return (
                  <div
                    key={user._id}
                    onClick={() => accessChat(user._id)}
                    className="flex items-center gap-3 p-3 md:p-3.5 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:bg-[#b026ff]/10 hover:border-[#b026ff]/30 active:scale-[0.98] group"
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 overflow-hidden bg-black/50 group-hover:border-[#b026ff]/50 transition-colors shadow-inner">
                        <img
                          src={
                            user.avatar ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username || "user"}`
                          }
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* 🔥 RADAR ONLINE DOT 🔥 */}
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#39ff14] border-2 border-[#0a0a0a] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.8)] z-10"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex justify-between items-center">
                      <div className="flex flex-col">
                        <h4 className="text-[11px] md:text-xs font-bold text-gray-200 truncate tracking-wide group-hover:text-white transition-colors">
                          {user.username || user.name}
                        </h4>
                        <span className="text-[9px] md:text-[10px] text-gray-500 font-mono truncate mt-0.5">
                          {user.email}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#b026ff]/20 transition-colors">
                         <UserPlus className="w-4 h-4 text-gray-500 group-hover:text-[#b026ff] transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center px-3 py-2.5 mb-2 sticky top-0 bg-[#050505]/90 backdrop-blur-md z-20 border-b border-white/[0.05]">
              <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                Active_Connections
              </p>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="p-1.5 bg-white/5 hover:bg-[#b026ff]/20 active:bg-[#b026ff]/30 text-gray-400 hover:text-[#b026ff] rounded-lg transition-all border border-transparent hover:border-[#b026ff]/30 group"
                title="Deploy_New_Cluster"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {isChatsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 opacity-60">
                <Loader2 className="w-8 h-8 text-[#b026ff] animate-spin mb-4 drop-shadow-[0_0_8px_rgba(176,38,255,0.5)]" />
                <p className="text-[10px] uppercase tracking-widest text-[#b026ff] animate-pulse">
                  Scanning_Network...
                </p>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-12 opacity-50 flex flex-col items-center">
                 <Terminal className="w-8 h-8 text-gray-600 mb-4" />
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border border-white/10 px-4 py-2 rounded-lg bg-black/50">
                  No active footprints found.
                </p>
              </div>
            ) : (
              chats.map((chat) => {
                // 🔥 CHAT LIST ONLINE CHECK 🔥
                const otherUser = chat.users?.find((u) => u._id !== currentUser?._id);
                const isOnline = otherUser ? (onlineUsers || []).some(id => String(id) === String(otherUser._id)) : false;
                
                // 🔥 UNREAD NOTIFICATION LOGIC 🔥
                const unreadCount = notifications.filter((n) => n.chat._id === chat._id).length;
                const isActive = activeChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setActiveChat(chat);
                      setNotifications(notifications.filter((n) => n.chat._id !== chat._id));
                    }}
                    className={`flex items-center gap-3 md:gap-4 p-3 md:p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border group ${
                      isActive 
                        ? "bg-gradient-to-r from-[#b026ff]/20 to-[#b026ff]/5 border-[#b026ff]/30 shadow-[inset_4px_0_0_#b026ff]" 
                        : "border-transparent hover:bg-white/[0.03] active:bg-white/[0.05] hover:border-white/10"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full border overflow-hidden bg-black/50 shadow-inner transition-colors ${isActive ? 'border-[#b026ff]/50' : 'border-white/10 group-hover:border-white/20'}`}>
                        <img
                          src={getChatAvatar(chat)}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* 🔥 THE CHAT ONLINE GREEN DOT 🔥 */}
                      {!chat.isGroupChat && isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#39ff14] border-2 border-[#050505] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.8)] z-10"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className={`text-[12px] md:text-[13px] font-bold truncate tracking-wide pr-2 transition-colors ${
                          unreadCount > 0 ? "text-[#b026ff] drop-shadow-sm" : isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                        }`}>
                          {getChatName(chat)}
                        </h4>

                        {/* 🔥 THE GLOWING UNREAD BADGE 🔥 */}
                        {unreadCount > 0 && (
                          <div className="bg-[#b026ff] text-black text-[9px] font-black px-1.5 py-0.5 rounded-md animate-pulse shadow-[0_0_12px_rgba(176,38,255,0.8)] shrink-0 flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount} NEW
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-[10px] md:text-[11px] truncate font-mono tracking-wide ${
                        unreadCount > 0 
                          ? "text-white font-bold opacity-90" 
                          : isActive ? "text-gray-300" : "text-gray-500 group-hover:text-gray-400"
                      }`}>
                        {unreadCount > 0 
                          ? "Incoming transmission..." 
                          : (chat.latestMessage ? chat.latestMessage.content || "Attachment Received" : "Secure channel established.")}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;