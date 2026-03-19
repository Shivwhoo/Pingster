import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  X,
  Camera,
  Lock,
  Loader2,
  Check,
  Shield,
  Trash2,
} from "lucide-react";
import api from "../../config/api";
// Agar Redux me user update karne ka action hai, toh usko import karlena
// import { updateCredentials } from '../../redux/slices/authSlice';
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';


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
      toast.error("Avatar purged successfully! (Syncing with Matrix...)");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to purge avatar.");
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
      toast.error(
        "Avatar Updated Successfully! (Refresh to see changes globally)",
      );
      setAvatarFile(null);
      // dispatch(updateCredentials(data.data)); // Redux update if you have it
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update Avatar");
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
      toast.error("Identity Updated Successfully!");
      // dispatch(updateCredentials(data.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update details");
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
      toast.error("Security Key (Password) Updated Successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md sm:p-4 font-mono selection:bg-[#b026ff]/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-[#050505] border border-white/10 rounded-t-3xl md:rounded-2xl shadow-[0_0_80px_rgba(57,255,20,0.1)] overflow-hidden max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0 rounded-t-3xl md:rounded-2xl"></div>

            {/* Mobile Drag Indicator */}
            <div className="w-full flex justify-center pt-3 md:hidden absolute top-0 z-20">
              <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
            </div>

            <div className="p-5 md:p-6 border-b border-white/[0.08] flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-xl relative z-10 pt-8 md:pt-6 rounded-t-3xl md:rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#39ff14]/30 to-transparent"></div>
              <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2.5 drop-shadow-sm">
                <span className="p-1.5 bg-[#39ff14]/10 rounded-lg border border-[#39ff14]/20">
                  <User className="w-4 h-4 text-[#39ff14]" />
                </span>
                Node_Identity
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 active:bg-white/20 rounded-xl transition-all border border-transparent hover:border-white/10 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]/50">
              {/* --- AVATAR SECTION --- */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#b026ff]/10 rounded-full blur-[20px] pointer-events-none"></div>
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-[#b026ff]/30 p-1.5 shadow-[0_0_30px_rgba(176,38,255,0.2)] overflow-hidden bg-black/50 relative z-10 transition-colors group-hover:border-[#b026ff]/60">
                    <img
                      src={
                        avatarPreview ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.username}`
                      }
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-sm">
                      <Camera className="w-6 h-6 text-white md:w-8 md:h-8" />
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
                      className="absolute -top-1 -right-1 md:top-0 md:right-0 p-2 bg-[#0a0a0a] border border-red-500/40 text-red-500 rounded-full hover:bg-red-500 hover:text-white active:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50 z-20 active:scale-95"
                    >
                      {isAvatarRemoving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {avatarFile && (
                  <button
                    onClick={submitAvatar}
                    disabled={isAvatarUpdating}
                    className="px-5 py-2 md:py-2.5 bg-[#b026ff]/20 text-[#b026ff] hover:bg-[#b026ff] hover:text-black active:bg-[#901ecc] active:text-white border border-[#b026ff]/30 rounded-xl text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-sm active:scale-95"
                  >
                    {isAvatarUpdating ? (
                      <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                    ) : (
                      "Upload_Patch"
                    )}
                  </button>
                )}
              </div>

              <div className="h-px w-full bg-white/[0.05]"></div>

              {/* --- DETAILS SECTION --- */}
              <form
                onSubmit={submitDetails}
                className="space-y-4 md:space-y-5 bg-black/40 p-4 md:p-5 border border-white/[0.05] rounded-2xl shadow-inner relative"
              >
                <div className="absolute top-0 left-4 w-12 h-[1px] bg-[#b026ff]/30"></div>
                <h3 className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <User className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#b026ff]" />{" "}
                  Basic_Parameters
                </h3>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest ml-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent transition-all text-white font-mono shadow-inner"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest ml-1">
                    Email_Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent transition-all text-white font-mono shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    isDetailsUpdating ||
                    (username === currentUser.username &&
                      email === currentUser.email)
                  }
                  className="w-full py-3 md:py-3.5 bg-white/5 hover:bg-[#b026ff]/20 active:bg-[#b026ff] text-gray-300 hover:text-[#b026ff] active:text-black border border-white/5 hover:border-[#b026ff]/30 text-[10px] md:text-[11px] font-bold tracking-widest uppercase rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-300 disabled:hover:border-white/5 disabled:active:bg-white/5 disabled:active:text-gray-300 active:scale-95"
                >
                  {isDetailsUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                  ) : (
                    "Sync_Identity"
                  )}
                </button>
              </form>

              {/* --- PASSWORD SECTION --- */}
              <form
                onSubmit={submitPassword}
                className="space-y-4 md:space-y-5 bg-black/40 p-4 md:p-5 border border-white/[0.05] rounded-2xl shadow-inner relative"
              >
                <div className="absolute top-0 left-4 w-12 h-[1px] bg-[#39ff14]/30"></div>
                <h3 className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#39ff14]" />{" "}
                  Security_Keys
                </h3>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest ml-1">
                    Current_Key
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#39ff14]/30 focus:border-transparent transition-all text-white font-mono shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest ml-1">
                    New_Key
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-[13px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#39ff14]/30 focus:border-transparent transition-all text-white font-mono shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPasswordUpdating || !oldPassword || !newPassword}
                  className="w-full py-3 md:py-3.5 bg-[#39ff14]/10 hover:bg-[#39ff14]/20 active:bg-[#39ff14] text-[#39ff14] active:text-black border border-[#39ff14]/30 text-[10px] md:text-[11px] font-bold tracking-widest uppercase rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-30 disabled:hover:bg-[#39ff14]/10 disabled:active:bg-[#39ff14]/10 disabled:active:text-[#39ff14] active:scale-95"
                >
                  {isPasswordUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
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
