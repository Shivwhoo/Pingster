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
        const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'pingster'}`; // Note: Changed 'name' to 'username' to match your state variable
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
    <div className="min-h-[100dvh] w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111111] via-[#050505] to-[#000000] text-[#e0e0e0] font-mono overflow-hidden relative flex items-center justify-center antialiased selection:bg-[#b026ff]/30 py-8">
      
      {/* 1. ARCHITECTURAL BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
        
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff]/50 to-transparent z-10 drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#b026ff]/10 md:bg-[#b026ff]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      </div>

      <motion.div variants={containerVars} initial="hidden" animate="visible" className="relative z-20 w-full max-w-[420px] px-5 sm:px-0">
        
        <div className="text-center mb-6 sm:mb-8">
          <motion.div variants={itemVars} className="inline-flex items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-transparent mb-4 sm:mb-5 border border-white/10 shadow-[0_0_30px_-10px_rgba(176,38,255,0.3)] backdrop-blur-md">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-[#b026ff]" />
          </motion.div>
          <motion.h1 variants={itemVars} className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase italic font-mono drop-shadow-md">
            Pingster<span className="text-[#b026ff] not-italic drop-shadow-[0_0_10px_rgba(176,38,255,0.8)]">.</span>
          </motion.h1>
          <motion.p variants={itemVars} className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 uppercase mt-2 sm:mt-3 font-mono">
            Register New Identity
          </motion.p>
        </div>

        <motion.div variants={itemVars} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(176,38,255,0.12)] relative overflow-hidden group">
          {/* Refined Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-l-2 border-[#b026ff]/50 rounded-tl-2xl transition-all duration-500 group-hover:border-[#b026ff]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-r-2 border-[#b026ff]/50 rounded-br-2xl transition-all duration-500 group-hover:border-[#b026ff]"></div>

          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
            
            {/* 1. Username Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase font-mono tracking-widest">_Username</label>
              </div>
              <div className="relative">
                <User className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                <input 
                  type="text" 
                  name="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-[13px] sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent focus:bg-white/[0.03] transition-all tracking-wide shadow-inner"
                  placeholder="operator_name"
                />
              </div>
            </div>

            {/* 2. Email Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase font-mono tracking-widest">Account_ID</label>
              </div>
              <div className="relative">
                <Cpu className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-[13px] sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent focus:bg-white/[0.03] transition-all tracking-wide shadow-inner"
                  placeholder="operator@pingster.io"
                />
              </div>
            </div>

            {/* 3. Password Input */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase font-mono tracking-widest">Pass_Cipher</label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-[13px] sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent focus:bg-white/[0.03] transition-all tracking-wide shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* 4. Avatar Upload (Optional) */}
            <div className="space-y-1.5 sm:space-y-2">
               <div className="flex justify-between items-center px-1">
                 <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase font-mono tracking-widest">Avatar_Data (Opt)</label>
               </div>
               <div className="flex items-center gap-3 sm:gap-4">
                  {/* Preview Circle */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-black/50 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                     {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'pingster'}`} alt="Default" className="w-full h-full p-1 opacity-70" />
                     )}
                  </div>
                  {/* File Input */}
                  <div className="flex-1 relative">
                     <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="avatar-upload" />
                     <label htmlFor="avatar-upload" className="flex items-center justify-center gap-2 w-full bg-black/50 border border-white/10 hover:border-[#b026ff]/50 hover:bg-white/[0.03] rounded-xl px-4 py-3 sm:py-3.5 text-[11px] sm:text-xs font-mono cursor-pointer transition-all text-gray-400 hover:text-white shadow-inner">
                        <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="truncate max-w-[120px] sm:max-w-[160px]">
                           {avatarFile ? avatarFile.name : 'Upload Image'}
                        </span>
                     </label>
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 relative py-3.5 sm:py-4 bg-white text-black font-black font-mono uppercase text-[11px] sm:text-xs tracking-[0.2em] rounded-xl overflow-hidden group transition-all hover:shadow-[0_0_30px_-5px_rgba(176,38,255,0.5)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-0 group-hover:w-full bg-[#b026ff] transition-all duration-400 ease-out z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                {loading ? 'Processing...' : 'Deploy_Node'}
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              </span>
            </button>
          </form>

          {error && (
            <div className="mt-4 sm:mt-5 text-center bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] sm:text-[10px] font-bold font-mono tracking-widest uppercase py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></span>
              {error}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVars} className="mt-6 sm:mt-8 flex justify-center gap-8">
            <Link to="/login" className="text-[10px] sm:text-[11px] font-mono text-gray-500 hover:text-[#b026ff] transition-colors uppercase tracking-widest flex items-center gap-2 group font-bold">
                <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:animate-pulse" /> Execute_Login
            </Link>
        </motion.div>
      </motion.div>

      {/* 4. GRAIN OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
};

export default Signup;