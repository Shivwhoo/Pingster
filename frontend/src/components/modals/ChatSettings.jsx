import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, X, Edit2, Loader2, Plus, LogOut as LeaveIcon ,Radio} from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';
const ChatSettings = ({ isOpen, onClose, activeChat, setActiveChat, chats, setChats, currentUser }) => {
  const [renameValue, setRenameValue] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [isManagingGroup, setIsManagingGroup] = useState(false);
  
  // Search states specific to this modal
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Jab modal khule, toh input me automatically current group ka naam aa jaye
  useEffect(() => {
    if (activeChat?.isGroupChat) {
      setRenameValue(activeChat.chatName);
    }
  }, [activeChat, isOpen]);

  if (!activeChat) return null;

  // --- LOGIC FUNCTIONS ---
  const handleRenameGroup = async () => {
    if (!renameValue || renameValue === activeChat.chatName) return;
    try {
      setIsRenaming(true);
      const { data } = await api.put("/chats/rename", {
        chatId: activeChat._id,
        chatName: renameValue,
      });
      const updatedChat = data?.data || data;
      setActiveChat(updatedChat);
      setChats(chats.map((c) => (c._id === updatedChat._id ? updatedChat : c)));
    } catch (error) {
      console.error("Rename failed");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) return setSearchResults([]);
    try {
      const { data } = await api.get(`/users?search=${query}`);
      setSearchResults(data?.data || data || []);
    } catch (error) {
      console.error("Search failed");
    }
  };

  const handleAddUserToGroup = async (userToAdd) => {
    if (activeChat.users.find((u) => u._id === userToAdd._id)) {
      return toast.error("Node already exists in this cluster!");
    }
    const adminId = activeChat.groupAdmin._id || activeChat.groupAdmin;
    if (adminId !== currentUser._id) {
      return toast.error("Access Denied: Only Admins can inject nodes!");
    }

    try {
      setIsManagingGroup(true);
      const { data } = await api.put('/chats/groupadd', {
        chatId: activeChat._id,
        userId: userToAdd._id,
      });
      const updatedChat = data?.data || data;
      setActiveChat(updatedChat);
      setChats(chats.map(c => c._id === updatedChat._id ? updatedChat : c));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding user!");
    } finally {
      setIsManagingGroup(false);
    }
  };

  const handleRemoveFromGroup = async (userToRemove) => {
    const adminId = activeChat.groupAdmin._id || activeChat.groupAdmin;
    if (adminId !== currentUser._id && userToRemove._id !== currentUser._id) {
      return toast.error("Only Group Admins can remove members!");
    }
    try {
      setIsManagingGroup(true);
      const { data } = await api.put("/chats/groupremove", {
        chatId: activeChat._id,
        userId: userToRemove._id,
      });
      const updatedChat = data?.data || data;
      
      if (userToRemove._id === currentUser._id) {
        setActiveChat(null);
        onClose();
      } else {
        setActiveChat(updatedChat);
      }
      setChats(chats.map((c) => (c._id === activeChat._id ? updatedChat : c)));
    } catch (error) {
      console.error("Remove failed");
    } finally {
      setIsManagingGroup(false);
    }
  };

  // --- HELPERS ---
  const getChatAvatar = (chat) => {
    if (chat.isGroupChat) return `https://api.dicebear.com/7.x/initials/svg?seed=${chat.chatName}`;
    const otherUser = chat.users?.find((u) => u._id !== currentUser?._id);
    return otherUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${otherUser?.username || "user"}`;
  };

  const getChatName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users?.find((u) => u._id !== currentUser?._id);
    return otherUser?.username || otherUser?.name || "Unknown_Entity";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md sm:p-4 font-mono selection:bg-[#b026ff]/30"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 100 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 100 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-[#050505] border border-white/10 rounded-t-3xl md:rounded-2xl shadow-[0_0_80px_rgba(176,38,255,0.15)] overflow-hidden max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0"></div>

            {/* Mobile Drag Indicator */}
            <div className="w-full flex justify-center pt-3 md:hidden absolute top-0 z-20">
              <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="p-5 md:p-6 border-b border-white/[0.08] flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-xl relative z-10 pt-8 md:pt-6">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff]/20 to-transparent"></div>
              <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2.5 drop-shadow-sm">
                <span className="p-1.5 bg-[#b026ff]/10 rounded-lg border border-[#b026ff]/20">
                   <Hash className="w-4 h-4 text-[#b026ff]" />
                </span>
                {activeChat.isGroupChat ? "Cluster_Settings" : "Node_Identity"}
              </h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 active:bg-white/20 rounded-xl transition-all border border-transparent hover:border-white/10 active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]/50">
              {/* Big Avatar */}
              <div className="flex justify-center mb-6 md:mb-8 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#b026ff]/10 rounded-full blur-[30px] pointer-events-none"></div>
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-white/10 bg-black/50 p-1.5 shadow-[0_0_40px_rgba(176,38,255,0.15)] relative z-10 group cursor-pointer hover:border-[#b026ff]/50 transition-colors">
                  <div className="w-full h-full rounded-full overflow-hidden border border-[#050505]">
                     <img src={getChatAvatar(activeChat)} alt="avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {activeChat.isGroupChat ? (
                /* GROUP CHAT SETTINGS */
                <div className="space-y-6 md:space-y-8">
                  {/* Rename Group */}
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1">Cluster_Name</label>
                    <div className="flex items-center gap-2 md:gap-3">
                      <input
                        type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl py-3.5 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent transition-all text-white font-mono shadow-inner"
                      />
                      <button
                        onClick={handleRenameGroup}
                        disabled={isRenaming || !renameValue || renameValue === activeChat.chatName}
                        className="p-3.5 bg-white/5 text-gray-400 border border-white/10 hover:border-[#b026ff]/30 active:bg-[#b026ff] active:text-white md:hover:bg-[#b026ff] md:hover:text-black rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-400 disabled:hover:border-white/10 shrink-0 shadow-sm active:scale-95"
                      >
                        {isRenaming ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Edit2 className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Add Member (Admin Only Search) */}
                  {(activeChat.groupAdmin._id || activeChat.groupAdmin) === currentUser._id && (
                    <div className="space-y-2 relative">
                      <label className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1">Inject_New_Node</label>
                      <input 
                        type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#39ff14]/30 focus:border-transparent transition-all text-white font-mono shadow-inner"
                        placeholder="Search user to add..."
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute w-full mt-2 max-h-40 overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-20 custom-scrollbar p-1">
                          {searchResults.map(user => (
                            <div 
                              key={user._id} 
                              onMouseDown={(e) => { 
                                e.preventDefault(); 
                                handleAddUserToGroup(user); 
                                setSearchResults([]); 
                                setSearchQuery(''); 
                              }} 
                              className="px-3 py-2.5 hover:bg-[#39ff14]/10 rounded-lg text-xs cursor-pointer flex justify-between items-center border border-transparent hover:border-[#39ff14]/20 transition-colors group"
                            >
                              <span className="font-bold text-gray-200 group-hover:text-white truncate">{user.username || user.name}</span>
                              <div className="p-1.5 bg-white/5 rounded-md group-hover:bg-[#39ff14]/20 transition-colors shrink-0">
                                 <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#39ff14]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Member List */}
                  <div className="bg-black/40 border border-white/[0.05] rounded-2xl p-4 md:p-5 shadow-inner relative">
                     <div className="absolute top-0 left-4 w-12 h-[1px] bg-[#b026ff]/30"></div>
                    <label className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-4 flex justify-between items-center">
                      <span>Connected_Nodes</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-white">{activeChat.users.length}</span>
                    </label>
                    <div className="space-y-2 max-h-48 md:max-h-56 overflow-y-auto custom-scrollbar pr-1">
                      {activeChat.users.map((u) => (
                        <div key={u._id} className="flex items-center justify-between bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05] hover:border-white/10 transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username || "user"}`} className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-white/10 object-cover shrink-0" alt="avatar"/>
                            <div className="flex flex-col truncate">
                               <span className="text-[11px] md:text-xs font-mono font-bold text-gray-200 truncate">
                                 {u.username || u.name}
                               </span>
                               {u._id === (activeChat.groupAdmin._id || activeChat.groupAdmin) && (
                                 <span className="text-[#b026ff] text-[8px] font-bold tracking-widest uppercase mt-0.5">Admin</span>
                               )}
                            </div>
                          </div>
                          {(activeChat.groupAdmin._id === currentUser._id || u._id === currentUser._id) && (
                            <button
                              onClick={() => handleRemoveFromGroup(u)} disabled={isManagingGroup}
                              className="text-gray-500 hover:text-red-500 active:text-white bg-white/5 hover:bg-red-500/10 active:bg-red-500 rounded-lg p-2 transition-all border border-transparent hover:border-red-500/20 active:scale-95 shrink-0"
                              title={u._id === currentUser._id ? "Leave Cluster" : "Eject Node"}
                            >
                              {u._id === currentUser._id ? <LeaveIcon className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* 1-ON-1 CHAT INFO */
                <div className="text-center space-y-3 pb-4">
                  <h3 className="text-xl md:text-2xl font-black tracking-widest uppercase text-white drop-shadow-md truncate px-4">{getChatName(activeChat)}</h3>
                  <div className="inline-flex items-center gap-2 bg-[#b026ff]/10 border border-[#b026ff]/20 px-3 py-1.5 rounded-full">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] animate-pulse"></span>
                     <p className="text-[9px] md:text-[10px] text-[#b026ff] font-bold uppercase tracking-widest">End_To_End_Encrypted</p>
                  </div>
                  
                  <div className="mt-8 p-5 bg-black/40 border border-white/5 rounded-2xl shadow-inner text-left mx-auto max-w-[280px]">
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                       <Radio className="w-3 h-3" /> Connection Status
                    </p>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_8px_rgba(57,255,20,0.6)]"></span>
                       <p className="text-[11px] md:text-xs font-mono text-[#39ff14] truncate">Online / Matrix Linked</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatSettings;