import { useState } from "react";
import { Terminal, MoreVertical, Loader2, Paperclip, Send, Edit2, Trash2, X, Download, ArrowLeft } from "lucide-react"; // 🔥 ArrowLeft added

const ChatBox = ({
  activeChat, setActiveChat, getChatAvatar, getChatName, openChatInfo, // 🔥 setActiveChat added here
  isMessagesLoading, messages, currentUser, formatTime,
  isTyping, messagesEndRef, sendMessage, newMessage, 
  setNewMessage, typingHandler, handleDeleteMessage, 
  handleEditClick, editingMessage, selectedFiles, setSelectedFiles, scrollToBottom
}) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  return (
    <div className="flex flex-1 flex-col relative bg-[#050505] font-mono selection:bg-[#b026ff]/30 w-full h-full max-w-full overflow-hidden">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0 mix-blend-screen"></div>

      {!activeChat ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 opacity-70 px-4 text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 mb-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center shadow-[0_0_40px_rgba(176,38,255,0.05)] backdrop-blur-sm relative group overflow-hidden">
            <div className="absolute inset-0 bg-[#b026ff]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
            <Terminal className="w-8 h-8 md:w-10 md:h-10 text-[#b026ff] relative z-10 drop-shadow-[0_0_8px_rgba(176,38,255,0.5)]" />
          </div>
          <h2 className="text-lg md:text-xl font-black tracking-widest uppercase mb-3 text-white drop-shadow-md">Awaiting_Connection</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0"></span>
            <p className="text-[10px] md:text-[11px] text-gray-500 tracking-[0.2em] font-mono uppercase">Select a node to establish a secure channel</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative z-10 h-full w-full">
          {/* 🔥 CHAT HEADER 🔥 */}
          <div className="h-[65px] md:h-[76px] px-3 md:px-6 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between shrink-0 shadow-sm relative z-20">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff]/20 to-transparent"></div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {/* 🔥 MOBILE BACK BUTTON 🔥 */}
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveChat(null); }} 
                className="md:hidden p-2 text-gray-500 hover:text-white active:bg-white/10 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={openChatInfo}>
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/10 overflow-hidden bg-black/50 shrink-0 group-hover:border-[#b026ff]/50 transition-colors shadow-inner">
                  <img src={getChatAvatar(activeChat)} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-bold tracking-widest text-white group-hover:text-[#b026ff] transition-colors drop-shadow-sm truncate max-w-[140px] sm:max-w-[250px]">{getChatName(activeChat)}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5 md:mt-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse shrink-0"></span>
                     <p className="text-[8px] md:text-[9px] text-[#39ff14] uppercase tracking-widest opacity-80 truncate">Encrypted_Tunnel_Active</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={openChatInfo} className="p-2 md:p-2.5 text-gray-500 hover:text-white transition-all bg-white/5 rounded-xl border border-white/5 hover:border-[#b026ff]/30 hover:bg-white/10 active:scale-95">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* 🔥 MESSAGES AREA 🔥 */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-5 custom-scrollbar relative z-10">
            {isMessagesLoading ? (
              <div className="flex justify-center items-center h-full opacity-50"><Loader2 className="w-8 h-8 text-[#b026ff] animate-spin drop-shadow-[0_0_8px_rgba(176,38,255,0.5)]" /></div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                 <Terminal className="w-6 h-6 text-gray-500 mb-3" />
                 <div className="text-center text-gray-500 text-[10px] tracking-widest uppercase font-bold border border-white/10 px-4 py-2 rounded-lg bg-white/5">Initiate Communication Protocol</div>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = (m.sender?._id || m.sender) === currentUser._id;
                return (
                  <div key={m._id} className={`flex flex-col group relative w-full ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] border px-3 py-2.5 md:px-4 md:py-3 relative group/bubble transition-all duration-200 ${
                      isMe 
                        ? "bg-gradient-to-br from-[#b026ff]/10 to-[#b026ff]/5 border-[#b026ff]/20 rounded-2xl rounded-tr-sm shadow-[0_4px_20px_-5px_rgba(176,38,255,0.15)] hover:border-[#b026ff]/40" 
                        : "bg-[#111111]/80 backdrop-blur-sm border-white/10 rounded-2xl rounded-tl-sm shadow-md hover:border-white/20"
                    }`}>
                      
                      {/* 🔥 EDIT/DELETE MENU (Desktop: Absolute Left | Mobile: Inline Bottom) 🔥 */}
                      {isMe && (
                        <>
                          {/* Desktop Hover Menu */}
                          <div className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 items-center gap-1.5 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 bg-black/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md z-10 shadow-lg">
                            <button onClick={() => handleEditClick(m)} className="p-1.5 text-gray-400 hover:text-[#b026ff] hover:bg-white/5 rounded-lg transition-all" title="Edit_Payload">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteMessage(m._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-lg transition-all" title="Purge_Payload">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}

                      {!isMe && activeChat.isGroupChat && (
                        <span className="text-[10px] text-[#39ff14]/80 block mb-1.5 font-bold tracking-wider">{m.sender?.username || m.sender?.name}</span>
                      )}

                      {/* 🔥 RENDER ATTACHMENTS 🔥 */}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {m.attachments.map((file, index) => (
                            <div key={index} className="rounded-xl overflow-hidden border border-white/10 max-w-[200px] md:max-w-[240px] bg-black/50 group/img relative cursor-zoom-in">
                              {file.fileType?.includes("image") ? (
                                <>
                                  <img 
                                    src={file.url} 
                                    alt="attachment" 
                                    onClick={() => setFullscreenImage(file.url)}
                                    onLoad={scrollToBottom}
                                    className="w-full h-auto object-cover md:group-hover/img:scale-105 md:group-hover/img:opacity-80 transition-all duration-300" 
                                  />
                                  <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                                     <Download className="w-6 h-6 text-white drop-shadow-md" />
                                  </div>
                                </>
                              ) : (
                                <a href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 md:p-3 bg-black/40 text-[10px] text-[#b026ff] active:bg-white/5 md:hover:bg-white/5 transition-colors group/file border-b border-transparent md:hover:border-[#b026ff]/30">
                                  <div className="p-1.5 bg-[#b026ff]/10 rounded-md group-hover/file:bg-[#b026ff]/20">
                                     <Paperclip className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="truncate tracking-wider active:underline md:hover:underline">File_Attachment</span>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* MESSAGE TEXT CONTENT */}
                      {m.content && (
                        <p className={`text-[12px] md:text-[13px] leading-relaxed font-mono ${isMe ? "text-[#f0f0f0]" : "text-gray-300"} tracking-wide whitespace-pre-wrap break-words`}>{m.content}</p>
                      )}

                      <span className={`text-[8px] md:text-[9px] mt-1.5 md:mt-2 block text-right font-mono tracking-widest ${isMe ? "text-[#b026ff]/60" : "text-gray-600"}`}>
                         {formatTime(m.createdAt || new Date())}
                      </span>
                    </div>

                    {/* Mobile Only: Inline Edit/Delete Menu (Shown directly below bubble for touch access) */}
                    {isMe && (
                       <div className="flex md:hidden justify-end gap-3 mt-1.5 mb-1 pr-1 opacity-60">
                          <button onClick={() => handleEditClick(m)} className="p-1 text-gray-400 active:text-[#b026ff] transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteMessage(m._id)} className="p-1 text-gray-400 active:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                       </div>
                    )}

                    {/* 🔥 READ RECEIPTS w/ TOOLTIPS 🔥 */}
                    {isMe && m.readBy && m.readBy.length > 0 && (
                      <div className="flex justify-end pr-1 mt-1.5 space-x-[-6px] md:space-x-[-8px] relative z-10 opacity-70 transition-all md:hover:opacity-100 md:hover:space-x-[-4px]">
                        {m.readBy.map((reader, idx) => {
                          const rId = reader._id || reader; 
                          if (rId === currentUser._id) return null; 
                          
                          const readerUser = activeChat.users?.find(u => u._id === rId);
                          if (!readerUser) return null;

                          return (
                            <div key={idx} className="relative group/reader cursor-pointer md:cursor-default">
                               <img 
                                 src={readerUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${readerUser.username}`}
                                 alt="Read"
                                 className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] rounded-full border border-[#050505] object-cover shadow-[0_0_8px_rgba(176,38,255,0.3)] transition-transform group-hover/reader:scale-125 group-active/reader:scale-125 group-hover/reader:z-20 group-active/reader:z-20 relative"
                               />
                               {/* 🔥 THE USERNAME TOOLTIP 🔥 */}
                               <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-1.5 px-2.5 py-1 bg-black/90 text-[9px] font-bold tracking-widest text-white rounded-md opacity-0 group-hover/reader:opacity-100 group-active/reader:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/20 z-50 shadow-lg uppercase">
                                  {readerUser.username || readerUser.name}
                               </span>
                            </div>
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
                <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3 shadow-md">
                  <div className="flex gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-bounce shadow-[0_0_5px_rgba(176,38,255,0.5)]" style={{ animationDelay: "0ms" }}></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-bounce shadow-[0_0_5px_rgba(176,38,255,0.5)]" style={{ animationDelay: "150ms" }}></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-bounce shadow-[0_0_5px_rgba(176,38,255,0.5)]" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-[9px] md:text-[10px] text-[#b026ff] font-mono tracking-widest uppercase opacity-80 border-l border-white/10 pl-2 md:pl-3">Incoming...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 🔥 INPUT FORM 🔥 */}
          <form onSubmit={sendMessage} className="p-2 md:p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.08] shrink-0 relative z-20 pb-safe">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff]/10 to-transparent"></div>
            
            {/* EDITING INDICATOR */}
            {editingMessage && (
              <div className="max-w-4xl mx-auto mb-2 flex justify-between items-center bg-[#b026ff]/10 border border-[#b026ff]/30 px-3 py-1.5 md:px-4 md:py-2 rounded-xl backdrop-blur-sm shadow-[0_0_15px_-5px_rgba(176,38,255,0.2)]">
                <span className="text-[9px] md:text-[10px] text-[#b026ff] font-bold tracking-widest uppercase flex items-center gap-1.5 md:gap-2 truncate">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-pulse shrink-0"></span>
                   [ EDIT_MODE ]
                </span>
                <button type="button" onClick={() => { setEditingMessage(null); setNewMessage(""); }} className="text-[9px] md:text-[10px] text-gray-400 hover:text-white active:text-white uppercase tracking-wider bg-black/50 px-2 py-1 md:px-3 md:py-1 rounded-lg border border-white/10 active:border-white/30 transition-all shrink-0">Cancel</button>
              </div>
            )}

            {/* FILE PREVIEW AREA */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="max-w-4xl mx-auto mb-2 flex gap-2 md:gap-3 overflow-x-auto custom-scrollbar p-2 bg-black/60 border border-white/5 rounded-2xl shadow-inner">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden border border-white/10 group">
                    {file.type.includes("image") ? (
                       <img src={URL.createObjectURL(file)} className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-300" alt="preview" />
                    ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center bg-[#111111] text-[8px] md:text-[9px] text-[#b026ff] tracking-widest"><Paperclip className="w-4 h-4 md:w-5 md:h-5 mb-1 opacity-70"/> FILE</div>
                    )}
                    <div className="hidden md:block absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button type="button" onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))} className="absolute top-1 right-1 p-1 bg-black/80 rounded-lg text-red-500 active:bg-red-500 active:text-white md:hover:bg-red-500 md:hover:text-white border border-white/10 transition-all shadow-lg z-10">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="max-w-4xl mx-auto relative flex items-center">
              <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="absolute left-2 md:left-3 p-2 md:p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 active:text-[#b026ff] active:bg-white/10 md:hover:text-[#b026ff] md:hover:border-[#b026ff]/30 md:hover:bg-white/10 transition-all cursor-pointer z-10 active:scale-95">
                <Paperclip className="w-4 h-4 md:w-4 md:h-4" />
              </label>

              <input
                type="text" value={newMessage} onChange={typingHandler}
                placeholder="Transmit..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 md:py-3.5 pl-12 pr-14 md:pl-14 md:pr-16 text-[13px] md:text-sm focus:outline-none focus:border-[#b026ff]/50 focus:bg-white/[0.02] focus:ring-4 focus:ring-[#b026ff]/10 transition-all text-white placeholder-gray-600 tracking-wide font-mono shadow-inner"
              />
              
              <button 
                type="submit" 
                disabled={!newMessage.trim() && (!selectedFiles || selectedFiles.length === 0)} 
                className="absolute right-2 p-2 md:p-2.5 bg-white text-black rounded-xl active:bg-[#b026ff] active:text-white md:hover:bg-[#b026ff] md:hover:text-white transition-all disabled:opacity-30 disabled:active:bg-white disabled:active:text-black disabled:cursor-not-allowed group active:scale-95 border border-transparent md:hover:border-white/20 md:hover:shadow-[0_0_20px_rgba(176,38,255,0.4)]"
              >
                <Send className="w-4 h-4 md:ml-0.5 md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </div>
          </form>

          {/* 🔥 FULLSCREEN IMAGE MODAL 🔥 */}
          {fullscreenImage && (
            <div 
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 cursor-zoom-out"
              onClick={() => setFullscreenImage(null)}
            >
              <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center group/modal w-full">
                {/* Mobile top controls */}
                <div className="absolute top-4 right-4 md:-top-16 md:right-0 flex gap-3 opacity-100 md:opacity-0 md:group-hover/modal:opacity-100 transition-opacity duration-300 z-50">
                  <a href={fullscreenImage} download target="_blank" rel="noreferrer" className="text-white md:text-gray-400 active:text-[#b026ff] md:hover:text-[#b026ff] transition-all bg-black/50 md:bg-white/5 p-3 rounded-xl border border-white/20 md:border-white/10 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
                    <Download className="w-5 h-5" />
                  </a>
                  <button className="text-white md:text-gray-400 active:text-white md:hover:text-white transition-all bg-black/50 md:bg-white/5 p-3 rounded-xl border border-white/20 md:border-white/10 active:bg-red-500/50 md:hover:bg-red-500/20 md:hover:text-red-500 backdrop-blur-md" onClick={() => setFullscreenImage(null)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <img 
                  src={fullscreenImage} 
                  alt="Fullscreen Preview" 
                  className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-xl border border-white/5 shadow-[0_0_80px_rgba(176,38,255,0.1)] ring-1 ring-white/10"
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