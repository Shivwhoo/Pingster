import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Isko baad me banayenge
import ChatPage from './pages/ChatPage'; // Isko bhi baad me banayenge

function App() {
  return (
    <div className="h-[100dvh] w-full bg-[#09090b] text-gray-300 font-sans selection:bg-[#39ff14] selection:text-black overflow-hidden flex flex-col">
      
      <div className="flex-1 h-full w-full overflow-y-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;