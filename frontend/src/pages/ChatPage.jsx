import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import api from "../config/api";
import io from "socket.io-client";

import CreateGroup from "../components/modals/CreateGroup";
import ChatSettings from "../components/modals/ChatSettings";
import ChatBox from "../components/chat/ChatBox";

import Sidebar from "../components/chat/Sidebar";

import UserProfile from "../components/modals/UserProfile";

const ENDPOINT = "http://localhost:8000";

const ChatPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser =
    userInfo?.user ||
    userInfo?.loggedInUser ||
    userInfo?.data?.user ||
    userInfo; // --- CORE STATES ---

  const [chats, setChats] = useState([]);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // --- MESSAGE STATES ---

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMessagesLoading, setIsMessagesLoading] = useState(false); // --- RADAR STATES ---

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // --- SOCKET & TYPING STATES ---

  const socket = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null); // --- GROUP CREATION STATES ---

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false); // 🔥 NAYA: CHAT INFO / MANAGEMENT STATES 🔥

  const [isChatInfoModalOpen, setIsChatInfoModalOpen] = useState(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // --- 1. SOCKET BOOTUP ---

  useEffect(() => {
    if (currentUser) {
      socket.current = io(ENDPOINT);
      socket.current.emit("setup", currentUser);
      socket.current.on("connected", () => setSocketConnected(true));
      socket.current.on("typing", () => setIsTyping(true));
      socket.current.on("stop typing", () => setIsTyping(false));
    }
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [currentUser]); // --- 2. FETCH CHATS ---

  useEffect(() => {
    const fetchMyChats = async () => {
      try {
        setIsChatsLoading(true);
        const { data } = await api.get("/chats");
        setChats(data?.data || data || []);
      } catch (error) {
        console.error("Failed to fetch chats");
      } finally {
        setIsChatsLoading(false);
      }
    };
    if (currentUser) fetchMyChats();
  }, [currentUser]); // --- 3. FETCH MESSAGES ---

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        setIsMessagesLoading(true);
        const { data } = await api.get(`/messages/${activeChat._id}`);
        setMessages(data?.data || data || []);
        if (socket.current) socket.current.emit("join chat", activeChat._id);
      } catch (error) {
        console.error("Failed to fetch messages");
      } finally {
        setIsMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [activeChat]); // --- 4. REAL-TIME LISTENER ---

  useEffect(() => {
    if (!socket.current) return;
    const messageHandler = (newMessageReceived) => {
      if (!activeChat || activeChat._id !== newMessageReceived.chat._id) {
        console.log("New Message Alert:", newMessageReceived);
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };
    socket.current.on("message received", messageHandler);
    return () => socket.current.off("message received", messageHandler);
  }, [activeChat]); // --- 5. TYPING HANDLER ---

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", activeChat._id);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit("stop typing", activeChat._id);
      setTyping(false);
    }, 3000);
  }; // --- 6. SEND MESSAGE ---

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    socket.current.emit("stop typing", activeChat._id);
    setTyping(false);
    try {
      const { data } = await api.post("/messages", {
        content: newMessage,
        chatId: activeChat._id,
      });
      const sentMsg = data?.data || data;
      setNewMessage("");
      setMessages((prev) => [...prev, sentMsg]);
      if (socket.current) socket.current.emit("new message", sentMsg);
    } catch (error) {
      console.error("Failed to send message");
    }
  }; // --- RADAR & 1-ON-1 CHAT HELPERS ---

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) return setSearchResults([]);
    try {
      setIsSearching(true);
      const { data } = await api.get(`/users?search=${query}`);
      setSearchResults(data?.data || data || []);
    } catch (error) {
      console.error("Radar scan failed");
    } finally {
      setIsSearching(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setIsChatsLoading(true);
      const { data } = await api.post("/chats", { userId });
      const newChat = data?.data || data;
      if (!chats.find((c) => c._id === newChat._id))
        setChats([newChat, ...chats]);
      setActiveChat(newChat);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Connection failed");
    } finally {
      setIsChatsLoading(false);
    }
  }; // 🔥 7. CHAT MANAGEMENT (RENAME, ADD, REMOVE) 🔥

  const openChatInfo = () => {
    setIsChatInfoModalOpen(true);
  }; // --- HELPERS ---

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };



  const getChatName = (chat) => {
    if (!chat) return "";
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users?.find((u) => u._id !== currentUser?._id);
    return otherUser?.username || otherUser?.name || "Unknown_Entity";
  };

  const getChatAvatar = (chat) => {
    if (!chat) return "";
    if (chat.isGroupChat)
      return `https://api.dicebear.com/7.x/initials/svg?seed=${chat.chatName}`;
    const otherUser = chat.users?.find((u) => u._id !== currentUser?._id);
    return (
      otherUser?.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${otherUser?.username || "user"}`
    );
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

    const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Purge this payload permanently?")) return;
    try {
      await api.delete(`/messages/${messageId}`);
      // UI se hata do
      setMessages(messages.filter((m) => m._id !== messageId));
      // Optional: Socket emit "message deleted"
    } catch (error) {
      alert("Purge failed!");
    }
  };

  const handleEditClick = (message) => {
    setEditingMessage(message);
    setNewMessage(message.content); // Input box me content daal do
  };
  // 🔥 YAHAN TAK 🔥

  return (
    <div className="h-[100dvh] w-full bg-[#050505] text-[#e0e0e0] font-mono overflow-hidden flex selection:bg-[#b026ff]/30 relative">
      {/* ================= LEFT PANEL (MODULARIZED) ================= */}
      <Sidebar
        currentUser={currentUser}
        socketConnected={socketConnected}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        accessChat={accessChat}
        setIsGroupModalOpen={setIsGroupModalOpen}
        isChatsLoading={isChatsLoading}
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        getChatAvatar={getChatAvatar}
        getChatName={getChatName}
        openProfile={() => setIsProfileModalOpen(true)}
      />
{/* ================= RIGHT PANEL (MODULARIZED) ================= */}
      <ChatBox
        activeChat={activeChat}
        getChatAvatar={getChatAvatar}
        getChatName={getChatName}
        openChatInfo={openChatInfo}
        isMessagesLoading={isMessagesLoading}
        messages={messages}
        currentUser={currentUser}
        formatTime={formatTime}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
        sendMessage={sendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage} // 🔥 Added
        typingHandler={typingHandler}
        handleDeleteMessage={handleDeleteMessage} // 🔥 Added
        handleEditClick={handleEditClick} // 🔥 Added
        editingMessage={editingMessage} // 🔥 Added
        setEditingMessage={setEditingMessage} // 🔥 Added
      />
      {/* ================= MODALS ================= */}

      <CreateGroup
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        chats={chats}
        setChats={setChats}
        setActiveChat={setActiveChat}
      />
      {/* 2. Chat Settings Modal */}

      <ChatSettings
        isOpen={isChatInfoModalOpen}
        onClose={() => setIsChatInfoModalOpen(false)}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        chats={chats}
        setChats={setChats}
        currentUser={currentUser}
      />
      {/* 3. User Profile Modal */}
      <UserProfile 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ChatPage;
