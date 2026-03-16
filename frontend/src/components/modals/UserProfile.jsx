import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X, Camera, Lock, Loader2, Check, Shield, Trash2 } from "lucide-react"; // 🔥 Trash2 added
import api from "../../config/api";
// Agar Redux me user update karne ka action hai, toh usko import karlena
// import { updateCredentials } from '../../redux/slices/authSlice';
import { useDispatch } from "react-redux";

const UserProfile = ({ isOpen, onClose, currentUser }) => {
  const dispatch = useDispatch();

  // States for Account Details
  const [username, setUsername] = useState(
    currentUser?.username || currentUser?.name || "",
  );
  const [email, setEmail] = useState(currentUser?.email || "");
  const [isDetailsUpdating, setIsDetailsUpdating] = useState(false);

  // States for Password Change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // States for Avatar Upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar);
  const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);
  
  // 🔥 NAYI STATE: Avatar Remove ke liye
  const [isAvatarRemoving, setIsAvatarRemoving] = useState(false);

  if (!currentUser) return null;

  // 🔥 NAYA FUNCTION: Avatar hatane ke liye
  const removeAvatar = async () => {
    if (!window.confirm("Purge Identity Avatar?")) return;
    try {
      setIsAvatarRemoving(true);
      // Backend route verify karlena (e.g., api.delete('/users/avatar'))
      await api.delete("/users/avatar"); 
      setAvatarPreview("");
      setAvatarFile(null);
      alert("Avatar purged successfully! (Syncing with Matrix...)");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to purge avatar.");
    } finally {
      setIsAvatarRemoving(false);
    }
  };

  // 1. Avatar Update Logic
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Local preview
    }
  };

  const submitAvatar = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile); // Backend field name check karlena

    try {
      setIsAvatarUpdating(true);
      const { data } = await api.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Avatar Updated Successfully! (Refresh to see changes globally)");
      setAvatarFile(null);
      // dispatch(updateCredentials(data.data)); // Redux update if you have it
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update Avatar");
    } finally {
      setIsAvatarUpdating(false);
    }
  };

  // 2. Account Details Update Logic
  const submitDetails = async (e) => {
    e.preventDefault();
    if (username === currentUser.username && email === currentUser.email)
      return;

    try {
      setIsDetailsUpdating(true);
      const { data } = await api.patch("/users/update-account", {
        username,
        email,
      });
      alert("Identity Updated Successfully!");
      // dispatch(updateCredentials(data.data));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update details");
    } finally {
      setIsDetailsUpdating(false);
    }
  };

  // 3. Password Change Logic
  const submitPassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    try {
      setIsPasswordUpdating(true);
      await api.post("/users/change-password", { oldPassword, newPassword });
      alert("Security Key (Password) Updated Successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(57,255,20,0.1)] overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="p-5 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-10">
              <h2 className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#39ff14]" /> Node_Identity
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* --- AVATAR SECTION --- */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-2 border-[#b026ff]/30 p-1 shadow-[0_0_20px_rgba(176,38,255,0.2)] overflow-hidden bg-black relative">
                    <img
                      src={
                        avatarPreview ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.username}`
                      }
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  {/* 🔥 NAYA: PURGE (REMOVE) BUTTON 🔥 */}
                  {(currentUser?.avatar || avatarPreview) && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      disabled={isAvatarRemoving}
                      title="Purge_Avatar"
                      className="absolute -top-1 -right-1 p-1.5 bg-[#0a0a0a] border border-red-500/40 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] disabled:opacity-50 z-10"
                    >
                      {isAvatarRemoving ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {avatarFile && (
                  <button
                    onClick={submitAvatar}
                    disabled={isAvatarUpdating}
                    className="px-4 py-1.5 bg-[#b026ff]/20 text-[#b026ff] hover:bg-[#b026ff] hover:text-black border border-[#b026ff]/30 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2"
                  >
                    {isAvatarUpdating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Upload_Patch"
                    )}
                  </button>
                )}
              </div>
              <div className="h-px w-full bg-white/5"></div>

              {/* --- DETAILS SECTION --- */}
              <form onSubmit={submitDetails} className="space-y-4">
                <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#b026ff]" /> Basic_Parameters
                </h3>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 px-4 text-xs focus:border-[#b026ff]/50 transition-all text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest">
                    Email_Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 px-4 text-xs focus:border-[#b026ff]/50 transition-all text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    isDetailsUpdating ||
                    (username === currentUser.username &&
                      email === currentUser.email)
                  }
                  className="w-full py-2.5 bg-white/5 hover:bg-[#b026ff]/20 text-gray-300 hover:text-[#b026ff] border border-white/5 hover:border-[#b026ff]/30 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isDetailsUpdating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Sync_Identity"
                  )}
                </button>
              </form>

              <div className="h-px w-full bg-white/5"></div>

              {/* --- PASSWORD SECTION --- */}
              <form onSubmit={submitPassword} className="space-y-4">
                <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[#39ff14]" /> Security_Keys
                </h3>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest">
                    Current_Key
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 px-4 text-xs focus:border-[#39ff14]/50 transition-all text-white font-mono"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-gray-600 uppercase tracking-widest">
                    New_Key
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 px-4 text-xs focus:border-[#39ff14]/50 transition-all text-white font-mono"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPasswordUpdating || !oldPassword || !newPassword}
                  className="w-full py-2.5 bg-[#39ff14]/10 hover:bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/30 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isPasswordUpdating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Update_Security_Protocol"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;