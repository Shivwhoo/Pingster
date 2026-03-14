import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatApp from '../components/ChatApp';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Home page se jo username bheja tha, wo yahan access hoga
  const username = location.state?.username;

  useEffect(() => {
    // Agar koi direct URL type karke aane ki koshish kare bina login ke
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  // Jab tak redirect ho raha hai ya check ho raha hai
  if (!username) return null;

  return (
    <div className="h-screen w-full bg-[#050505]">
      {/* Asli chat interface ko yahan render kar rahe hain, aur username pass kar rahe hain */}
      <ChatApp currentUser={username} />
    </div>
  );
};

export default Chat;