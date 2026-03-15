import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, X, Edit2, Loader2, Plus, LogOut as LeaveIcon } from 'lucide-react';
import api from '../../config/api';

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
      return alert("Node already exists in this cluster!");
    }
    const adminId = activeChat.groupAdmin._id || activeChat.groupAdmin;
    if (adminId !== currentUser._id) {
      return alert("Access Denied: Only Admins can inject nodes!");
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
      alert(error.response?.data?.message || "Error adding user!");
    } finally {
      setIsManagingGroup(false);
    }
  };

  const handleRemoveFromGroup = async (userToRemove) => {
    const adminId = activeChat.groupAdmin._id || activeChat.groupAdmin;
    if (adminId !== currentUser._id && userToRemove._id !== currentUser._id) {
      return alert("Only Group Admins can remove members!");
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(176,38,255,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#b026ff]" />{" "}
                {activeChat.isGroupChat ? "Cluster_Settings" : "Node_Identity"}
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Big Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full border-2 border-[#b026ff]/30 p-1 shadow-[0_0_30px_rgba(176,38,255,0.2)]">
                  <img src={getChatAvatar(activeChat)} alt="avatar" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>

              {activeChat.isGroupChat ? (
                /* GROUP CHAT SETTINGS */
                <div className="space-y-6">
                  {/* Rename Group */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cluster_Name</label>
                      <input
                        type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 px-4 text-xs focus:border-[#b026ff]/50 transition-all text-white font-mono"
                      />
                    </div>
                    <button
                      onClick={handleRenameGroup}
                      disabled={isRenaming || !renameValue || renameValue === activeChat.chatName}
                      className="p-3 bg-[#b026ff]/20 text-[#b026ff] border border-[#b026ff]/30 hover:bg-[#b026ff] hover:text-black rounded-xl transition-all disabled:opacity-50 h-[42px]"
                    >
                      {isRenaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Add Member (Admin Only Search) */}
                  {(activeChat.groupAdmin._id || activeChat.groupAdmin) === currentUser._id && (
                    <div className="space-y-1.5 relative">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Inject_New_Node</label>
                      <input 
                        type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 px-4 text-xs focus:border-[#39ff14]/50 transition-all text-white font-mono"
                        placeholder="Search user to add..."
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute w-full mt-1 max-h-32 overflow-y-auto bg-[#1a1a1a] border border-[#39ff14]/30 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.1)] z-10 custom-scrollbar">
                          {searchResults.map(user => (
                            <div 
                              key={user._id} 
                              onMouseDown={(e) => { 
                                e.preventDefault(); 
                                handleAddUserToGroup(user); 
                                setSearchResults([]); 
                                setSearchQuery(''); 
                              }} 
                              className="px-4 py-2 hover:bg-[#39ff14]/20 text-xs cursor-pointer flex justify-between items-center border-b border-white/5"
                            >
                              <span className="font-bold">{user.username || user.name}</span>
                              <Plus className="w-3 h-3 text-[#39ff14]" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Member List */}
                  <div className="bg-[#121212] border border-white/10 rounded-xl p-4">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-3">
                      Connected_Nodes ({activeChat.users.length})
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {activeChat.users.map((u) => (
                        <div key={u._id} className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-white/5">
                          <div className="flex items-center gap-2">
                            <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username || "user"}`} className="w-6 h-6 rounded-md" alt="avatar"/>
                            <span className="text-xs font-mono">
                              {u.username || u.name}{" "}
                              {u._id === (activeChat.groupAdmin._id || activeChat.groupAdmin) && (
                                <span className="text-[#b026ff] text-[8px] ml-1">[ADMIN]</span>
                              )}
                            </span>
                          </div>
                          {(activeChat.groupAdmin._id === currentUser._id || u._id === currentUser._id) && (
                            <button
                              onClick={() => handleRemoveFromGroup(u)} disabled={isManagingGroup}
                              className="text-red-500 hover:text-red-400 p-1"
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
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold tracking-widest uppercase text-white">{getChatName(activeChat)}</h3>
                  <p className="text-xs text-[#b026ff] font-mono tracking-widest">End_To_End_Encrypted</p>
                  <div className="mt-6 p-4 bg-[#121212] border border-white/10 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs font-mono text-[#39ff14]">Online / Connected to Matrix</p>
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