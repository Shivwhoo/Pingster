import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // UI State: Login dikhana hai ya Signup?
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    
    // Yahan baad me aapka asli backend/Firebase aayega.
    // Abhi ke liye hum assume kar rahe hain login/signup success ho gaya.
    if (username.trim() || email.trim()) {
      const activeUser = isLogin ? (email.split('@')[0] || 'hacker') : username;
      console.log(`Executing ${isLogin ? 'Login' : 'Signup'} for:`, activeUser);
      
      // User ko chat page par bhej do auth ke baad
      navigate('/chat', { state: { username: activeUser } });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#e0e0e0] font-mono overflow-hidden">
      
      {/* Background Grid */}
      <style dangerouslySetInnerHTML={{__html: `
        .bg-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(0, 255, 204, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 204, 0.03) 1px, transparent 1px);
          animation: pan 30s linear infinite;
        }
        @keyframes pan {
          0% { background-position: 0px 0px; }
          100% { background-position: 50px 50px; }
        }
      `}} />
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none"></div>

      {/* Terminal Auth Box */}
      <div className="relative z-10 w-full max-w-md p-8 bg-[#0a0a0a]/80 backdrop-blur-md border border-[#1a1a1a] rounded shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#00ffcc] tracking-[0.2em] drop-shadow-[0_0_10px_rgba(0,255,204,0.4)]">
            NEXUS_CORE
          </h1>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">
            {isLogin ? 'Authentication Protocol' : 'New User Registration'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-6">
          
          {/* Email Input (Dono me chahiye) */}
          <div className="relative flex items-center border-b-2 border-[#1a1a1a] focus-within:border-[#00ffcc] transition-colors duration-300 pb-2">
            <span className="text-[#00ffcc] mr-3 font-bold">&gt;</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@network.com"
              className="w-full bg-transparent border-none outline-none text-white font-mono placeholder-gray-700"
              required
            />
          </div>

          {/* Username (Sirf Signup me chahiye) */}
          {!isLogin && (
            <div className="relative flex items-center border-b-2 border-[#1a1a1a] focus-within:border-[#00ffcc] transition-colors duration-300 pb-2 animate-fadeIn">
              <span className="text-[#00ffcc] mr-3 font-bold">&gt;</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Desired handle..."
                className="w-full bg-transparent border-none outline-none text-white font-mono placeholder-gray-700"
                required={!isLogin}
              />
            </div>
          )}

          {/* Password Input (Dono me chahiye) */}
          <div className="relative flex items-center border-b-2 border-[#1a1a1a] focus-within:border-[#bf00ff] transition-colors duration-300 pb-2">
            <span className="text-[#bf00ff] mr-3 font-bold">&gt;</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter cipher key (password)"
              className="w-full bg-transparent border-none outline-none text-white font-mono placeholder-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 border border-[#00ffcc]/50 text-[#00ffcc] font-bold tracking-widest uppercase hover:bg-[#00ffcc] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,255,204,0.1)] hover:shadow-[0_0_25px_rgba(0,255,204,0.4)]"
          >
            {isLogin ? 'Execute Login' : 'Initialize Account'}
          </button>
        </form>

        {/* Toggle Button */}
        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-gray-700 hover:decoration-[#00ffcc] underline-offset-4"
          >
            {isLogin 
              ? "No access clearance? Request new identity (Signup)" 
              : "Already registered? Authenticate here (Login)"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;