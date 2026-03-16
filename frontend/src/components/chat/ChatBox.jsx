import { useState } from "react";
import { Terminal, MoreVertical, Loader2, Paperclip, Send, Edit2, Trash2, X, Download } from "lucide-react";

const ChatBox = ({
  activeChat, getChatAvatar, getChatName, openChatInfo,
  isMessagesLoading, messages, currentUser, formatTime,
  isTyping, messagesEndRef, sendMessage, newMessage, 
  setNewMessage, typingHandler, handleDeleteMessage, 
  handleEditClick, editingMessage, selectedFiles, setSelectedFiles,scrollToBottom
}) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

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
                  <div key={m._id} className={`flex flex-col group relative ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[70%] border rounded-2xl px-4 py-3 shadow-md relative group ${isMe ? "bg-[#b026ff]/10 border-[#b026ff]/30 rounded-tr-sm shadow-[0_0_15px_rgba(176,38,255,0.1)]" : "bg-[#121212] border-white/10 rounded-tl-sm"}`}>
                      
                      {/* 🔥 EDIT/DELETE HOVER MENU 🔥 */}
                      {isMe && (
                        <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm z-10">
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

                      {/* 🔥 RENDER ATTACHMENTS (Images/Files) 🔥 */}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {m.attachments.map((file, index) => (
                            <div key={index} className="rounded-lg overflow-hidden border border-white/10 max-w-[200px]">
                              {file.fileType?.includes("image") ? (
                                <img 
                                  src={file.url} 
                                  alt="attachment" 
                                  onClick={() => setFullscreenImage(file.url)}
                                  onLoad={scrollToBottom}
                                  className="w-full h-auto object-cover hover:opacity-80 transition-opacity cursor-zoom-in" 
                                />
                              ) : (
                                <a href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-black/40 text-[10px] text-[#b026ff] hover:underline">
                                  <Paperclip className="w-3 h-3" /> File_Attachment
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* MESSAGE TEXT CONTENT */}
                      {m.content && (
                        <p className={`text-xs leading-relaxed font-mono ${isMe ? "text-white" : "text-gray-300"}`}>{m.content}</p>
                      )}

                      <span className={`text-[8px] mt-2 block text-right font-mono ${isMe ? "text-[#b026ff]/60" : "text-gray-600"}`}>{formatTime(m.createdAt || new Date())}</span>
                    </div>

                    {/* 🔥 NAYA: IG STYLE READ RECEIPTS (TINY PFPs) 🔥 */}
                    {isMe && m.readBy && m.readBy.length > 0 && (
                      <div className="flex justify-end pr-1 mt-1 space-x-[-6px] relative z-10 opacity-90 transition-all hover:opacity-100">
                        {m.readBy.map((reader, idx) => {
                          const rId = reader._id || reader; // Extracted ID
                          if (rId === currentUser._id) return null; // Khudka nahi dikhana
                          
                          // Dhoondho Active Chat me se kon hai ye user
                          const readerUser = activeChat.users?.find(u => u._id === rId);
                          if (!readerUser) return null;

                          return (
                            <img 
                              key={idx}
                              src={readerUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${readerUser.username}`}
                              alt="Read"
                              title={`Read by ${readerUser.username || readerUser.name}`}
                              className="w-[14px] h-[14px] rounded-full border border-[#030303] object-cover shadow-[0_0_5px_rgba(176,38,255,0.4)]"
                            />
                          );
                        })}
                      </div>
                    )}
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
            {/* EDITING INDICATOR */}
            {editingMessage && (
              <div className="max-w-4xl mx-auto mb-2 flex justify-between items-center bg-[#b026ff]/10 border border-[#b026ff]/30 px-4 py-1.5 rounded-lg">
                <span className="text-[10px] text-[#b026ff] font-bold tracking-widest uppercase animate-pulse">[ EDITING_MODE ]</span>
                <button type="button" onClick={() => { setEditingMessage(null); setNewMessage(""); }} className="text-[10px] text-gray-500 hover:text-white uppercase">Cancel_ESC</button>
              </div>
            )}

            {/* FILE PREVIEW AREA */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="max-w-4xl mx-auto mb-2 flex gap-2 overflow-x-auto custom-scrollbar p-2 bg-[#121212] border border-white/10 rounded-xl">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[#b026ff]/30">
                    {file.type.includes("image") ? (
                       <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 text-[8px] text-[#b026ff]"><Paperclip className="w-4 h-4 mb-1"/> FILE</div>
                    )}
                    <button type="button" onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))} className="absolute top-0.5 right-0.5 p-0.5 bg-black/80 rounded-full text-red-500 hover:bg-red-500 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-4xl mx-auto relative flex items-center">
              <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="absolute left-3 text-gray-500 hover:text-[#b026ff] transition-colors cursor-pointer z-10">
                <Paperclip className="w-5 h-5" />
              </label>

              <input
                type="text" value={newMessage} onChange={typingHandler}
                placeholder="Transmit_Payload..."
                className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-10 pr-14 text-sm focus:outline-none focus:border-[#b026ff]/50 focus:ring-1 focus:ring-[#b026ff]/50 transition-all text-white placeholder-gray-600 tracking-wide font-mono"
              />
              
              <button 
                type="submit" 
                disabled={!newMessage.trim() && (!selectedFiles || selectedFiles.length === 0)} 
                className="absolute right-2 p-1.5 bg-[#b026ff] text-black rounded-lg hover:bg-[#c452ff] hover:shadow-[0_0_15px_rgba(176,38,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>

          {/* 🔥 FULLSCREEN IMAGE MODAL 🔥 */}
          {fullscreenImage && (
            <div 
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
              onClick={() => setFullscreenImage(null)}
            >
              <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center group">
                <div className="absolute -top-12 right-0 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={fullscreenImage} download target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#39ff14] transition-colors bg-black/50 p-2 rounded-full border border-white/10" onClick={(e) => e.stopPropagation()}>
                    <Download className="w-5 h-5" />
                  </a>
                  <button className="text-gray-400 hover:text-red-500 transition-colors bg-black/50 p-2 rounded-full border border-white/10" onClick={() => setFullscreenImage(null)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <img 
                  src={fullscreenImage} 
                  alt="Fullscreen Preview" 
                  className="max-w-full max-h-[90vh] object-contain rounded-lg border border-white/10 shadow-[0_0_50px_rgba(176,38,255,0.15)]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ChatBox;