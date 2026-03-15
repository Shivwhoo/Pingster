import { Terminal, MoreVertical, Loader2, Paperclip, Send, Edit2, Trash2 } from "lucide-react";

const ChatBox = ({
  activeChat, getChatAvatar, getChatName, openChatInfo,
  isMessagesLoading, messages, currentUser, formatTime,
  isTyping, messagesEndRef, sendMessage, newMessage, 
  setNewMessage, typingHandler, handleDeleteMessage, 
  handleEditClick, editingMessage, setEditingMessage
}) => {
  return (
    <div className="hidden md:flex flex-1 flex-col relative bg-[#030303]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {!activeChat ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 opacity-60">
          <div className="w-20 h-20 mb-6 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(176,38,255,0.1)]">
            <Terminal className="w-8 h-8 text-[#b026ff]" />
          </div>
          <h2 className="text-xl font-bold tracking-widest uppercase mb-2">Awaiting_Connection</h2>
          <p className="text-xs text-gray-500 tracking-widest font-mono">Select a node to establish a secure channel.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative z-10 h-full">
          {/* 🔥 CHAT HEADER 🔥 */}
          <div className="h-[73px] px-6 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 cursor-pointer" onClick={openChatInfo}>
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-black/50 shrink-0">
                <img src={getChatAvatar(activeChat)} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-widest text-white hover:text-[#b026ff] transition-colors">{getChatName(activeChat)}</h3>
                <p className="text-[10px] text-[#39ff14] uppercase tracking-widest mt-0.5">Encrypted_Tunnel_Active</p>
              </div>
            </div>
            <button onClick={openChatInfo} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-[#b026ff]/30">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* 🔥 MESSAGES AREA 🔥 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {isMessagesLoading ? (
              <div className="flex justify-center items-center h-full opacity-50"><Loader2 className="w-8 h-8 text-[#b026ff] animate-spin" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-600 text-xs tracking-widest uppercase mt-10">Initiate Communication Protocol</div>
            ) : (
              messages.map((m) => {
                const isMe = (m.sender?._id || m.sender) === currentUser._id;
                return (
                  <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"} group relative`}>
                    <div className={`max-w-[70%] border rounded-2xl px-4 py-3 shadow-md relative group ${isMe ? "bg-[#b026ff]/10 border-[#b026ff]/30 rounded-tr-sm shadow-[0_0_15px_rgba(176,38,255,0.1)]" : "bg-[#121212] border-white/10 rounded-tl-sm"}`}>
                      
                      {/* 🔥 EDIT/DELETE HOVER MENU 🔥 */}
                      {isMe && (
                        <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                          <button onClick={() => handleEditClick(m)} className="text-gray-500 hover:text-[#b026ff] transition-colors" title="Edit_Payload">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteMessage(m._id)} className="text-gray-500 hover:text-red-500 transition-colors" title="Purge_Payload">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {!isMe && activeChat.isGroupChat && (
                        <span className="text-[9px] text-[#39ff14] block mb-1 font-bold">{m.sender?.username || m.sender?.name}</span>
                      )}
                      <p className={`text-xs leading-relaxed font-mono ${isMe ? "text-white" : "text-gray-300"}`}>{m.content}</p>
                      <span className={`text-[8px] mt-2 block text-right font-mono ${isMe ? "text-[#b026ff]/60" : "text-gray-600"}`}>{formatTime(m.createdAt || new Date())}</span>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-transparent border border-[#b026ff]/30 rounded-2xl rounded-tl-sm px-4 py-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  <span className="text-[10px] text-[#b026ff] font-mono tracking-widest ml-2 uppercase opacity-80 animate-pulse">Incoming_Transmission...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 🔥 INPUT FORM 🔥 */}
          <form onSubmit={sendMessage} className="p-4 bg-black/60 backdrop-blur-md border-t border-white/10 shrink-0">
            {/* 🔥 EDITING INDICATOR 🔥 */}
            {editingMessage && (
              <div className="max-w-4xl mx-auto mb-2 flex justify-between items-center bg-[#b026ff]/10 border border-[#b026ff]/30 px-4 py-1.5 rounded-lg">
                <span className="text-[10px] text-[#b026ff] font-bold tracking-widest uppercase animate-pulse">[ EDITING_MODE ]</span>
                <button type="button" onClick={() => { setEditingMessage(null); setNewMessage(""); }} className="text-[10px] text-gray-500 hover:text-white uppercase">Cancel_ESC</button>
              </div>
            )}
            <div className="max-w-4xl mx-auto relative flex items-center">
              <button type="button" className="absolute left-3 text-gray-500 hover:text-[#b026ff] transition-colors"><Paperclip className="w-5 h-5" /></button>
              <input
                type="text" value={newMessage} onChange={typingHandler}
                placeholder="Transmit_Payload..."
                className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-12 pr-14 text-sm focus:outline-none focus:border-[#b026ff]/50 focus:ring-1 focus:ring-[#b026ff]/50 transition-all text-white placeholder-gray-600 tracking-wide font-mono"
              />
              <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 p-1.5 bg-[#b026ff] text-black rounded-lg hover:bg-[#c452ff] hover:shadow-[0_0_15px_rgba(176,38,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-4 h-4 ml-0.5" /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;