import { Search, LogOut, Loader2, UserPlus, X, Wifi, Plus } from "lucide-react";

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
    <div className="w-full md:w-[350px] lg:w-[400px] h-full flex flex-col border-r border-white/10 bg-[#0a0a0a] relative z-20 shrink-0">
      {/* Profile Header */}
      <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 -ml-1.5 rounded-xl transition-colors"
          onClick={openProfile}
          title="Access Node Identity"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#b026ff]/30 bg-white/5 p-0.5 shadow-[0_0_10px_rgba(176,38,255,0.2)] shrink-0 relative">
            <img
              src={
                currentUser?.avatar ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.username || "user"}`
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-lg"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${socketConnected ? "bg-[#39ff14] shadow-[0_0_5px_#39ff14]" : "bg-red-500"} z-10`}
            ></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-widest uppercase truncate max-w-[150px]">
              {currentUser?.username || currentUser?.name || "UNKNOWN_NODE"}
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
              {socketConnected ? (
                <span className="text-[#39ff14] flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Network_Sync
                </span>
              ) : (
                "Connecting..."
              )}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Search Radar */}
      <div className="p-4 border-b border-white/5">
        <div className="relative group flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-600 group-focus-within:text-[#b026ff] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search_Entities..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs focus:outline-none focus:border-[#b026ff]/50 focus:ring-1 focus:ring-[#b026ff]/50 transition-all text-gray-300 tracking-wide font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => {
                handleSearch("");
                setSearchQuery("");
              }}
              className="absolute right-3 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat List / Radar Results */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {searchQuery ? (
          <>
            <p className="text-[9px] text-[#b026ff] font-bold uppercase tracking-widest px-3 py-2 mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-ping"></span>{" "}
              Radar_Results
            </p>
            {isSearching ? (
              <div className="flex justify-center py-6 opacity-50">
                <Loader2 className="w-5 h-5 text-[#b026ff] animate-spin" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-6 opacity-50">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Target not found.
                </p>
              </div>
            ) : (
              searchResults.map((user) => {
                const isOnline = (onlineUsers || []).some(id => String(id) === String(user._id)); // 🔥 Strict Type Fix

                return (
                  <div
                    key={user._id}
                    onClick={() => accessChat(user._id)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 hover:bg-[#b026ff]/10 hover:border-[#b026ff]/30 group"
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-black/50">
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
                        <h4 className="text-xs font-bold text-gray-200 truncate tracking-wide">
                          {user.username || user.name}
                        </h4>
                        <span className="text-[9px] text-gray-500 font-mono truncate">
                          {user.email}
                        </span>
                      </div>
                      <UserPlus className="w-4 h-4 text-gray-600 group-hover:text-[#b026ff] transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center px-3 py-2 mb-1">
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                Active_Connections
              </p>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="p-1 bg-white/5 hover:bg-[#b026ff]/20 text-gray-400 hover:text-[#b026ff] rounded-md transition-all border border-transparent hover:border-[#b026ff]/30 group"
                title="Deploy_New_Cluster"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {isChatsLoading ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <Loader2 className="w-6 h-6 text-[#b026ff] animate-spin mb-2" />
                <p className="text-[10px] uppercase tracking-widest">
                  Scanning_Network...
                </p>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
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

                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setActiveChat(chat);
                      // 🔥 NAYA: Jab chat khulegi, toh uski notifications gayab ho jayengi
                      setNotifications(notifications.filter((n) => n.chat._id !== chat._id));
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${activeChat?._id === chat._id ? "bg-[#b026ff]/10 border-[#b026ff]/30 shadow-[inset_4px_0_0_#b026ff]" : "hover:bg-white/5 hover:border-white/10"}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-black/50">
                        <img
                          src={getChatAvatar(chat)}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* 🔥 THE CHAT ONLINE GREEN DOT 🔥 */}
                      {!chat.isGroupChat && isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#39ff14] border-2 border-[#0a0a0a] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.8)] z-10"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-xs font-bold truncate tracking-wide ${unreadCount > 0 ? "text-[#b026ff]" : "text-gray-200"}`}>
                          {getChatName(chat)}
                        </h4>

                        {/* 🔥 THE GLOWING UNREAD BADGE 🔥 */}
                        {unreadCount > 0 && (
                          <div className="bg-[#b026ff] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md animate-pulse shadow-[0_0_10px_rgba(176,38,255,0.6)]">
                            {unreadCount > 9 ? "9+" : unreadCount} NEW
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-[10px] truncate font-mono ${unreadCount > 0 ? "text-white font-bold" : "text-gray-500"}`}>
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