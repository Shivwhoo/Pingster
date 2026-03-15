import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, X, UserPlus, Check } from 'lucide-react';
import api from '../../config/api'; // Path check karlena apne folder structure ke hisaab se

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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(176,38,255,0.15)] overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#b026ff]" /> Deploy_Cluster
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitGroupChat} className="p-5 space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cluster_Name</label>
                 <input 
                   type="text" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} 
                   className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 px-4 text-xs focus:border-[#b026ff]/50 transition-all text-white font-mono" 
                   placeholder="E.g. Pingster Devs" required 
                 />
              </div>

              <div className="space-y-1.5 relative">
                 <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Assign_Nodes</label>
                 <input 
                   type="text" value={groupSearchQuery} onChange={(e) => handleGroupSearch(e.target.value)} 
                   className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 px-4 text-xs focus:border-[#b026ff]/50 transition-all text-white font-mono" 
                   placeholder="Search user to add..." 
                 />
                 {groupSearchResults.length > 0 && (
                   <div className="absolute w-full mt-1 max-h-40 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-10 custom-scrollbar">
                     {groupSearchResults.map(user => (
                       <div key={user._id} onMouseDown={(e) => { e.preventDefault(); handleSelectUser(user); setGroupSearchResults([]); setGroupSearchQuery(''); }} className="px-4 py-2 hover:bg-[#b026ff]/20 text-xs cursor-pointer flex justify-between items-center border-b border-white/5">
                         <span>{user.username || user.name}</span><UserPlus className="w-3 h-3 text-gray-500" />
                       </div>
                     ))}
                   </div>
                 )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(u => (
                  <div key={u._id} className="flex items-center gap-1.5 bg-[#b026ff]/20 border border-[#b026ff]/40 px-2 py-1 rounded-md">
                    <span className="text-[10px] font-bold text-[#e0e0e0]">{u.username || u.name}</span>
                    <button type="button" onClick={() => handleRemoveUser(u)} className="text-[#b026ff] hover:text-white"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={isGroupCreating || selectedUsers.length < 2 || !groupChatName} className="w-full py-3 bg-[#b026ff] hover:bg-[#c452ff] text-black text-[11px] font-black tracking-widest uppercase rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-4">
                {isGroupCreating ? 'Deploying...' : 'Init_Cluster()'} {!isGroupCreating && <Check className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroup;