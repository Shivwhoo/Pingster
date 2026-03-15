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
    // Root font-mono set hai
    <div className="min-h-screen w-full bg-[#050505] text-[#e0e0e0] font-mono overflow-hidden relative flex items-center justify-center">
      
      {/* 1. ARCHITECTURAL BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#b026ff]/30 to-transparent z-10"
        />
      </div>

      {/* 2. DATA WINGS */}
      <div className="absolute inset-0 flex justify-between items-center px-12 pointer-events-none opacity-40 hidden xl:flex">
        {/* Left Wing */}
        <div className="w-64 space-y-8">
          <div className="border-l border-[#b026ff]/30 pl-4">
            <h4 className="text-[10px] text-[#b026ff] mb-2 font-black tracking-widest uppercase font-mono">Network_Nodes</h4>
            <div className="space-y-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-2 text-[9px] text-gray-500 font-mono">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                  Node_0x{i}FB8... Connected
                </div>
              ))}
            </div>
          </div>
          <div className="border-l border-gray-800 pl-4">
            <h4 className="text-[10px] text-gray-500 mb-2 font-black tracking-widest uppercase font-mono">Traffic_Analysis</h4>
            <div className="h-12 w-full bg-white/5 rounded flex items-end gap-1 p-1">
              {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                <motion.div key={i} animate={{ height: [`${h}%`, `${h-20}%`, `${h}%`] }} transition={{ repeat: Infinity, duration: 2, delay: i*0.2 }} className="flex-1 bg-[#b026ff]/40" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Wing */}
        <div className="w-64 text-right flex flex-col items-end space-y-8">
          <div className="border-r border-[#b026ff]/30 pr-4">
            <Globe className="w-6 h-6 text-[#b026ff] mb-2 ml-auto" />
            <p className="text-[9px] text-gray-400 font-mono">GLOBAL_ENCRYPTION_ACTIVE<br/>256-BIT_AES_TUNNEL</p>
          </div>
          <div className="border-r border-gray-800 pr-4">
             <Radio className="w-6 h-6 text-gray-700 mb-2 ml-auto animate-pulse" />
             <p className="text-[9px] text-gray-600 uppercase font-mono">Awaiting_Handshake...</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN LOGIN CORE */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-[420px] mx-4"
      >
        <div className="text-center mb-10">
          <motion.div variants={itemVars} className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-4 border border-white/10">
            <MessageSquare className="w-8 h-8 text-[#b026ff]" />
          </motion.div>
          <motion.h1 variants={itemVars} className="text-4xl font-black tracking-tighter text-white uppercase italic font-mono">
            Pingster<span className="text-[#b026ff] not-italic">.</span>
          </motion.h1>
          <motion.p variants={itemVars} className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mt-2 font-mono">
            Secure Communications Protocol
          </motion.p>
        </div>

        <motion.div variants={itemVars} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_-15px_rgba(176,38,255,0.2)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#b026ff]/40 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#b026ff]/40 rounded-br-3xl"></div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest">Account_Email</label>
                <Cpu className="w-3 h-3 text-gray-700" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // Explicit font-mono for browser override prevention
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm font-mono focus:outline-none focus:border-[#b026ff]/50 focus:bg-white/[0.08] transition-all tracking-wide"
                placeholder="operator@pingster.io"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-widest">Pass_Cipher</label>
                <KeyRound className="w-3 h-3 text-gray-700" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // Explicit font-mono here as well
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm font-mono focus:outline-none focus:border-[#b026ff]/50 focus:bg-white/[0.08] transition-all tracking-wide"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              // Button specific font-mono override
              className="w-full relative py-4 bg-white text-black font-black font-mono uppercase text-xs tracking-[0.2em] rounded-xl overflow-hidden group transition-all"
            >
              <div className="absolute inset-0 w-0 group-hover:w-full bg-[#b026ff] transition-all duration-300 ease-out z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                {loading ? 'Initializing...' : 'Authorize_Access'}
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

        <motion.div variants={itemVars} className="mt-8 flex justify-center gap-8">
            <Link to="/signup" className="text-[11px] font-mono text-gray-500 hover:text-[#b026ff] transition-colors uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Create_New_Node
            </Link>
        </motion.div>
      </motion.div>

      {/* 4. GRAIN OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default Login;