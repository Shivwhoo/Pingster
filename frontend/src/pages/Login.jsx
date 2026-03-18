import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Mail, KeyRound, Zap, MessageSquare, Globe, Cpu, Radio } from 'lucide-react';
import api from '../config/api';
import { setCredentials } from '../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Animation Variants ---
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/login', { email, password });
      dispatch(setCredentials(data.data.user || data.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'ERR_CONNECTION_REFUSED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111111] via-[#050505] to-[#000000] text-[#e0e0e0] font-mono overflow-hidden relative flex items-center justify-center antialiased selection:bg-[#b026ff]/30">
      
      {/* 1. ARCHITECTURAL BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
        
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b026ff]/50 to-transparent z-10 drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]"
        />
        {/* Added a subtle ambient glow behind the main card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#b026ff]/10 md:bg-[#b026ff]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      </div>

      {/* 2. DATA WINGS (Hidden on smaller screens) */}
      <div className="absolute inset-0 justify-between items-center px-12 pointer-events-none opacity-40 hidden xl:flex">
        {/* Left Wing */}
        <div className="w-64 space-y-8">
          <div className="border-l border-[#b026ff]/40 pl-4 relative">
            <div className="absolute -left-[1px] top-0 w-[2px] h-4 bg-[#b026ff]"></div>
            <h4 className="text-[10px] text-[#b026ff] mb-2 font-black tracking-widest uppercase font-mono drop-shadow-[0_0_5px_rgba(176,38,255,0.5)]">Network_Nodes</h4>
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-2 text-[9px] text-gray-400 font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                  Node_0x{i}FB8... Connected
                </div>
              ))}
            </div>
          </div>
          <div className="border-l border-gray-800 pl-4 relative">
            <h4 className="text-[10px] text-gray-500 mb-2 font-black tracking-widest uppercase font-mono">Traffic_Analysis</h4>
            <div className="h-12 w-full bg-black/40 rounded flex items-end gap-[2px] p-1 border border-white/5">
              {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                <motion.div key={i} animate={{ height: [`${h}%`, `${h-20}%`, `${h}%`] }} transition={{ repeat: Infinity, duration: 2, delay: i*0.2 }} className="flex-1 bg-gradient-to-t from-[#b026ff]/20 to-[#b026ff]/60 rounded-t-[1px]" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Wing */}
        <div className="w-64 text-right flex flex-col items-end space-y-8">
          <div className="border-r border-[#b026ff]/40 pr-4 relative">
            <div className="absolute -right-[1px] top-0 w-[2px] h-4 bg-[#b026ff]"></div>
            <Globe className="w-5 h-5 text-[#b026ff] mb-2 ml-auto drop-shadow-[0_0_8px_rgba(176,38,255,0.6)]" />
            <p className="text-[9px] text-gray-400 font-mono leading-relaxed">GLOBAL_ENCRYPTION_ACTIVE<br/>256-BIT_AES_TUNNEL</p>
          </div>
          <div className="border-r border-gray-800 pr-4">
             <Radio className="w-5 h-5 text-gray-600 mb-2 ml-auto animate-pulse" />
             <p className="text-[9px] text-gray-600 uppercase font-mono">Awaiting_Handshake...</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN LOGIN CORE */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-[420px] px-5 sm:px-0"
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div variants={itemVars} className="inline-flex items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-transparent mb-4 sm:mb-5 border border-white/10 shadow-[0_0_30px_-10px_rgba(176,38,255,0.3)] backdrop-blur-md">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-[#b026ff]" />
          </motion.div>
          <motion.h1 variants={itemVars} className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase italic font-mono drop-shadow-md">
            Pingster<span className="text-[#b026ff] not-italic drop-shadow-[0_0_10px_rgba(176,38,255,0.8)]">.</span>
          </motion.h1>
          <motion.p variants={itemVars} className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 uppercase mt-2 sm:mt-3 font-mono">
            Secure Communications Protocol
          </motion.p>
        </div>

        <motion.div variants={itemVars} className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(176,38,255,0.12)] relative overflow-hidden group">
          {/* Refined Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-l-2 border-[#b026ff]/50 rounded-tl-2xl transition-all duration-500 group-hover:border-[#b026ff]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-r-2 border-[#b026ff]/50 rounded-br-2xl transition-all duration-500 group-hover:border-[#b026ff]"></div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase font-mono tracking-widest">Account_Email</label>
                <Cpu className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-600" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-[13px] sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent focus:bg-white/[0.03] transition-all tracking-wide shadow-inner"
                placeholder="operator@pingster.io"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase font-mono tracking-widest">Pass_Cipher</label>
                <KeyRound className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-600" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-[13px] sm:text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b026ff]/50 focus:border-transparent focus:bg-white/[0.03] transition-all tracking-wide shadow-inner"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 relative py-3.5 sm:py-4 bg-white text-black font-black font-mono uppercase text-[11px] sm:text-xs tracking-[0.2em] rounded-xl overflow-hidden group transition-all hover:shadow-[0_0_30px_-5px_rgba(176,38,255,0.5)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 w-0 group-hover:w-full bg-[#b026ff] transition-all duration-400 ease-out z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                {loading ? 'Initializing...' : 'Authorize_Access'}
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
            <Link to="/signup" className="text-[10px] sm:text-[11px] font-mono text-gray-500 hover:text-[#b026ff] transition-colors uppercase tracking-widest flex items-center gap-2 group">
                <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:animate-pulse" /> Create_New_Node
            </Link>
        </motion.div>
      </motion.div>

      {/* 4. GRAIN OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    </div>
  );
};

export default Login;