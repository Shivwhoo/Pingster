import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true, // FIX: Ab yeh default page ban gaya hai. Direct '/' par Home khulega.
        element: <Home />
      },
      {
        path: 'chat', // FIX: Nested routes me aage '/' lagane ki zaroorat nahi hoti.
        element: <Chat />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)