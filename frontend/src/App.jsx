import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    // Global dark background so pages transitioning don't flash white
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      <Outlet />
    </div>
  )
}

export default App