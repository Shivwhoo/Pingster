import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Mail, KeyRound, Zap, MessageSquare, Cpu, User, Image as ImageIcon } from 'lucide-react';
import api from '../config/api';

const Signup = () => {
  // 1. STATE MANAGEMENT (Focus here)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Avatar handling states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // --- Animation Variants (Kept same as Login for stability) ---
  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
  const itemVars = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  // 2. FILE SELECTION LOGIC
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // FileReader se image ka instant preview banate hain UI ke liye
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 3. THE SUBMIT LOGIC (Core Engine)
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic Frontend Validation
    if (password.length < 6) {
      setLoading(false);
      return setError('Password must be at least 6 characters.');
    }

    try {
      // Kyunki image file ho sakti hai, hum normal JSON nahi, FormData bhejenge
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      // THE AVATAR PLAN
      if (avatarFile) {
        // Agar user ne file chuni hai, toh file bhej do (Multer handle karega)
        formData.append('avatar', avatarFile);
      } else {
        // Agar file nahi hai, toh naam ke basis par ek unique random avatar generate karke string bhej do
        // Note: Make sure tumhara backend string URL ko accept kare agar req.file undefined ho.
        const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${name || 'pingster'}`;
        formData.append('avatar', defaultAvatar);
      }

      // API Call (FormData ke sath 'multipart/form-data' header zaroori hota hai)
      await api.post('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success hone par sidha login page bhej do
      navigate('/login');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#e0e0e0] font-mono overflow-hidden relative flex items-center justify-center">
      
      {/* Background & Data Wings (Same as Login) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="visible" className="relative z-20 w-full max-w-[420px] mx-4 py-8">
        
        <div className="text-center mb-8">
          <motion.div variants={itemVars} className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-4 border border-white/10">
            <MessageSquare className="w-8 h-8 text-[#b026ff]" />
          </motion.div>
          <motion.h1 variants={itemVars} className="text-4xl font-black tracking-tighter text-white uppercase italic font-mono">
            Pingster<span className="text-[#b026ff] not-italic">.</span>
          </motion.h1>
          <motion.p variants={itemVars} className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mt-2 font-mono">
            Register New Identity
          </motion.p>
        </div>

        <motion.div variants={itemVars} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_-15px_rgba(176,38,255,0.2)] relative overflow-hidden">
          <form onSubmit={handleSignup} className="space-y-5">
            
            {/* 1. Name Input */}
{/* 1. Username Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest pl-1">_Username</label>
              <div className="relative">
                <User className="absolute left-4 top-4 w-4 h-4 text-gray-600" />
                <input 
                  type="text" 
                  name="username" // <--- Added name attribute just in case
                  value={username} // <--- Changed here
                  onChange={(e) => setUsername(e.target.value)} // <--- Changed here
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-5 py-3 text-sm font-mono focus:outline-none focus:border-[#b026ff]/50 transition-all text-white tracking-wide"
                  placeholder="bhupendar jogi"
                />
              </div>
            </div>

            {/* 2. Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest pl-1">Account_ID</label>
              <div className="relative">
                <Cpu className="absolute left-4 top-4 w-4 h-4 text-gray-600" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-5 py-3 text-sm font-mono focus:outline-none focus:border-[#b026ff]/50 transition-all text-white"
                  placeholder="operator@pingster.io"
                />
              </div>
            </div>

            {/* 3. Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest pl-1">Pass_Cipher</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-4 w-4 h-4 text-gray-600" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-5 py-3 text-sm font-mono focus:outline-none focus:border-[#b026ff]/50 transition-all text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* 4. Avatar Upload (Optional) */}
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest pl-1">Avatar_Data (Optional)</label>
               <div className="flex items-center gap-4">
                  {/* Preview Circle */}
                  <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                     {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${name || 'pingster'}`} alt="Default" className="w-full h-full p-1" />
                     )}
                  </div>
                  {/* File Input */}
                  <div className="flex-1 relative">
                     <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="avatar-upload" />
                     <label htmlFor="avatar-upload" className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/5 hover:border-[#b026ff]/30 rounded-xl px-4 py-3 text-xs font-mono cursor-pointer transition-all text-gray-400 hover:text-white">
                        <ImageIcon className="w-4 h-4" />
                        {avatarFile ? avatarFile.name.substring(0, 15) + '...' : 'Upload Image'}
                     </label>
                  </div>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full relative py-4 mt-2 bg-white text-black font-black font-mono uppercase text-xs tracking-[0.2em] rounded-xl overflow-hidden group transition-all">
              <div className="absolute inset-0 w-0 group-hover:w-full bg-[#b026ff] transition-all duration-300 ease-out z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                {loading ? 'Processing...' : 'Deploy_Node'}
                <Zap className="w-4 h-4 fill-current" />
              </span>
            </button>
          </form>

          {error && (
            <div className="mt-4 text-center text-red-500 text-[10px] font-bold font-mono tracking-widest uppercase animate-pulse">
              [!] {error}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVars} className="mt-6 flex justify-center gap-8 font-mono">
            <Link to="/login" className="text-[11px] font-mono text-gray-500 hover:text-[#b026ff] transition-colors uppercase tracking-[0.2em] flex items-center gap-2 font-bold">
                <Terminal className="w-3 h-3" /> Execute_Login
            </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;