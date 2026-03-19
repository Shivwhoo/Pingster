import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="h-[100dvh] w-full bg-[#09090b] text-gray-300 font-sans selection:bg-[#39ff14] selection:text-black overflow-hidden flex flex-col">
      <div className="flex-1 h-full w-full overflow-y-auto">
        <Routes>
          
          <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!userInfo ? <Signup /> : <Navigate to="/" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;