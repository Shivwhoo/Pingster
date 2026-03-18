import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, X, UserPlus, Check, Plus } from 'lucide-react';
import api from '../../config/api';

const CreateGroup = ({ isOpen, onClose, chats, setChats, setActiveChat }) => {
  // Yeh saari states ab ChatPage ki jagah yahan zinda rahengi
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [isGroupCreating, setIsGroupCreating] = useState(false);

  // Search Logic
  const handleGroupSearch = async (query) => {
    setGroupSearchQuery(query);
    if (!query.trim()) return setGroupSearchResults([]);
    try {
      const { data } = await api.get(`/users?search=${query}`);
      setGroupSearchResults(data?.data || data || []);
    } catch (error) {
      console.error("Group member search failed");
    }
  };

  const handleSelectUser = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) return;
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

  // Submit Logic
  const submitGroupChat = async (e) => {
    e.preventDefault();
    if (!groupChatName || selectedUsers.length === 0) return;
    try {
      setIsGroupCreating(true);
      const { data } = await api.post('/chats/group', {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });
      const newGroup = data?.data || data;
      
      // Update ChatPage states via props
      setChats([newGroup, ...chats]); 
      setActiveChat(newGroup); 
      
      // Reset Modal
      setGroupChatName('');
      setSelectedUsers([]);
      setGroupSearchQuery('');
      onClose(); // Modal band karo
    } catch (error) {
      console.error("Failed to create group");
    } finally {
      setIsGroupCreating(false);
    }
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
            className="w-full max-w-md bg-[#050505] border border-white/10 rounded-t-3xl md:rounded-2xl shadow-[0_0_80px_rgba(176,38,255,0.15)] overflow-visible max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0 rounded-t-3xl md:rounded-2xl"></div>

            {/* Mobile Drag Indicator */}
            <div className="w-full flex justify-center pt-3 md:hidden absolute top-0 z-20">
              <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="p-5 md:p-6 border-b border-white/[0.08] flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-xl relative z-10 pt-8 md:pt-6 rounded-t-3xl md:rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff]/20 to-transparent"></div>
              <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2.5 drop-shadow-sm">
                <span className="p-1.5 bg-[#b026ff]/10 rounded-lg border border-[#b026ff]/20">
                   <Hash className="w-4 h-4 text-[#b026ff]" />
                </span>
                Deploy_Cluster
              </h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 active:bg-white/20 rounded-xl transition-all border border-transparent hover:border-white/10 active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitGroupChat} className="p-5 md:p-6 space-y-5 md:space-y-6 overflow-y-auto custom-scrollbar relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]/50">
              {/* Cluster Name Input */}
              <div className="space-y-2">
                 <label className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1">Cluster_Name</label>
                 <input 
                   type="text" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} 
                   className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent transition-all text-white font-mono shadow-inner" 
                   placeholder="E.g. Pingster Devs" required 
                 />
              </div>

              {/* User Search Input */}
              <div className="space-y-2 relative">
                 <label className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1">Assign_Nodes</label>
                 <input 
                   type="text" value={groupSearchQuery} onChange={(e) => handleGroupSearch(e.target.value)} 
                   className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent transition-all text-white font-mono shadow-inner" 
                   placeholder="Search user to add..." 
                 />
                 
                 {/* Search Results Dropdown */}
                 {groupSearchResults.length > 0 && (
                   <div className="absolute w-full mt-2 max-h-40 overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-20 custom-scrollbar p-1">
                     {groupSearchResults.map(user => (
                       <div 
                         key={user._id} 
                         onMouseDown={(e) => { 
                           e.preventDefault(); 
                           handleSelectUser(user); 
                           setGroupSearchResults([]); 
                           setGroupSearchQuery(''); 
                         }} 
                         className="px-3 py-2.5 hover:bg-[#b026ff]/20 active:bg-[#b026ff]/30 rounded-lg text-xs cursor-pointer flex justify-between items-center border border-transparent hover:border-[#b026ff]/30 transition-colors group"
                       >
                         <span className="font-bold text-gray-200 group-hover:text-white truncate pr-2">{user.username || user.name}</span>
                         <div className="p-1.5 bg-white/5 rounded-md group-hover:bg-[#b026ff]/20 transition-colors shrink-0">
                            <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#b026ff]" />
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>

              {/* Selected Users Badges */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedUsers.map(u => (
                    <div key={u._id} className="flex items-center gap-1.5 bg-[#b026ff]/10 border border-[#b026ff]/30 pl-2.5 pr-1.5 py-1.5 rounded-lg group hover:border-[#b026ff]/50 hover:bg-[#b026ff]/20 transition-all shadow-sm">
                      <span className="text-[10px] md:text-[11px] font-bold text-[#e0e0e0] group-hover:text-white truncate max-w-[100px]">{u.username || u.name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveUser(u)} 
                        className="text-gray-400 hover:text-red-500 active:text-red-500 bg-black/40 hover:bg-red-500/10 p-1 rounded-md transition-colors"
                      >
                        <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isGroupCreating || selectedUsers.length < 2 || !groupChatName} 
                className="w-full mt-4 relative py-3.5 md:py-4 bg-white text-black font-black font-mono uppercase text-[11px] md:text-xs tracking-[0.2em] rounded-xl overflow-hidden group transition-all hover:shadow-[0_0_30px_-5px_rgba(176,38,255,0.5)] active:scale-[0.98] disabled:opacity-30 disabled:hover:shadow-none disabled:active:scale-100 disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed border border-transparent disabled:border-white/10"
              >
                {!isGroupCreating && selectedUsers.length >= 2 && groupChatName && (
                   <div className="absolute inset-0 w-0 group-hover:w-full bg-[#b026ff] transition-all duration-400 ease-out z-0"></div>
                )}
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white disabled:group-hover:text-gray-500 transition-colors duration-300">
                  {isGroupCreating ? 'Deploying...' : 'Init_Cluster()'} 
                  {!isGroupCreating && <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                </span>
              </button>

              {/* Helper text if not enough users */}
              {selectedUsers.length > 0 && selectedUsers.length < 2 && (
                <p className="text-[9px] text-center text-red-400/80 uppercase tracking-widest mt-2 animate-pulse font-bold">
                  * Minimum 2 nodes required to init cluster *
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroup;