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
import toast from 'react-hot-toast';


const ENDPOINT = "https://pingster-tone.onrender.com";

const ChatPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser =
    userInfo?.user ||
    userInfo?.loggedInUser ||
    userInfo?.data?.user ||
    userInfo;

  // --- CORE STATES ---
  const [chats, setChats] = useState([]);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  // --- MESSAGE STATES ---
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  // --- RADAR STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // --- SOCKET & TYPING STATES ---
  const socket = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // --- GROUP CREATION & MODAL STATES ---
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isChatInfoModalOpen, setIsChatInfoModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const messagesEndRef = useRef(null);
const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- 1. SOCKET BOOTUP ---
  useEffect(() => {
    if (currentUser) {
      socket.current = io(ENDPOINT);
      socket.current.emit("setup", currentUser);
      socket.current.on("connected", () => setSocketConnected(true));

      socket.current.on("get-online-users", (users) => {
        setOnlineUsers(users);
      });

      // 🔥 NAYA: Real-time Edit/Delete sync form other users 🔥
      socket.current.on("message deleted", (deletedMsg) => {
        setMessages((prev) => prev.filter((m) => m._id !== deletedMsg._id));
      });

      socket.current.on("message edited", (editedMsg) => {
        setMessages((prev) =>
          prev.map((m) => (m._id === editedMsg._id ? editedMsg : m)),
        );
      });

      socket.current.on("messages read", ({ chatId, userId }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.sender._id === currentUser._id) {
              const currentReaders = msg.readBy || [];
              if (!currentReaders.includes(userId)) {
                return { ...msg, readBy: [...currentReaders, userId] };
              }
            }
            return msg;
          }),
        );
      });
    }
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [currentUser]);

  // --- SMART TYPING TRACKER ---
  useEffect(() => {
    if (!socket.current) return;

    const handleTyping = (room) => {
      if (activeChat && activeChat._id === room) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (room) => {
      if (activeChat && activeChat._id === room) {
        setIsTyping(false);
      }
    };

    socket.current.on("typing", handleTyping);
    socket.current.on("stop typing", handleStopTyping);

    return () => {
      socket.current.off("typing", handleTyping);
      socket.current.off("stop typing", handleStopTyping);
    };
  }, [activeChat]);

  // --- 2. FETCH CHATS ---
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
  }, [currentUser]);

  // --- 3. FETCH MESSAGES ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        setIsMessagesLoading(true);
        const { data } = await api.get(`/messages/${activeChat._id}`);
        setMessages(data?.data || data || []);
        if (socket.current) socket.current.emit("join chat", activeChat._id);

        await api.put(`/messages/${activeChat._id}/read`);
        socket.current.emit("mark as read", {
          chatId: activeChat._id,
          userId: currentUser._id,
        });
      } catch (error) {
        console.error("Failed to fetch messages");
      } finally {
        setIsMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [activeChat]);

  // --- 4. REAL-TIME LISTENER ---
  useEffect(() => {
    if (!socket.current) return;
    const messageHandler = async (newMessageReceived) => {
      // Part A: Notification & Messages logic
      if (!activeChat || activeChat._id !== newMessageReceived.chat._id) {
        const audio = new Audio(
          "https://cdn.pixabay.com/download/audio/2021/08/09/audio_82e21b0231.mp3",
        );
        audio
          .play()
          .catch((e) => console.log("Audio play blocked by browser:", e));
        setNotifications((prev) => [newMessageReceived, ...prev]);
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
        try {
          await api.put(`/messages/${activeChat._id}/read`);
          socket.current.emit("mark as read", {
            chatId: activeChat._id,
            userId: currentUser._id,
          });
        } catch (err) {
          console.error(err);
        }
      }

      // 🔥 Part B: NAYA LOGIC - Update Sidebar Chats Dynamically 🔥
      setChats((prevChats) => {
        const chatExists = prevChats.some(
          (c) => c._id === newMessageReceived.chat._id,
        );
        if (chatExists) {
          // Chat ko update karo aur top par laao
          let updatedChats = prevChats.map((c) =>
            c._id === newMessageReceived.chat._id
              ? { ...c, latestMessage: newMessageReceived }
              : c,
          );
          const chatToMove = updatedChats.find(
            (c) => c._id === newMessageReceived.chat._id,
          );
          updatedChats = updatedChats.filter(
            (c) => c._id !== newMessageReceived.chat._id,
          );
          return [chatToMove, ...updatedChats];
        } else {
          // Agar naya chat create hua hai to list me daalo
          return [newMessageReceived.chat, ...prevChats];
        }
      });
    };

    socket.current.on("message received", messageHandler);
    return () => socket.current.off("message received", messageHandler);
  }, [activeChat]);

  // --- 5. TYPING HANDLER ---
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
  };

  // --- 6. SEND MESSAGE ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    socket.current.emit("stop typing", activeChat._id);
    setTyping(false);

    try {
      if (editingMessage) {
        // 1. Backend par update bhejo
        const { data } = await api.patch(
          `/messages/${editingMessage._id}/edit`,
          {
            content: newMessage,
          },
        );
        const updatedMsg = data.data || data;

        // 2. Chat window update karo (Functional approach se stale state issue nahi hoga)
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m._id === editingMessage._id ? updatedMsg : m,
          ),
        );

        // 3. Sidebar (Chats list) update karo
        setChats((prevChats) =>
          prevChats.map((c) => {
            // Agar yeh message is chat ka sabse latest message tha, toh sidebar mein bhi text badal do
            if (
              c._id === activeChat._id &&
              c.latestMessage?._id === updatedMsg._id
            ) {
              return { ...c, latestMessage: updatedMsg };
            }
            return c;
          }),
        );

        // 4. Dusre user ko socket ke through batao
        if (socket.current) socket.current.emit("message edited", updatedMsg);

        setEditingMessage(null);
        setNewMessage("");
      } else {
        // --- NAYA MESSAGE BHEJNE WALA LOGIC (Same as before) ---
        let dataToSend;
        let headers = {};

        if (selectedFiles.length > 0) {
          dataToSend = new FormData();
          dataToSend.append("chatId", activeChat._id);
          if (newMessage.trim()) dataToSend.append("content", newMessage);

          selectedFiles.forEach((file) => {
            dataToSend.append("attachments", file);
          });
          headers = { "Content-Type": "multipart/form-data" };
        } else {
          dataToSend = { content: newMessage, chatId: activeChat._id };
        }

        const { data } = await api.post("/messages", dataToSend, { headers });
        const sentMsg = data?.data || data;

        setNewMessage("");
        setSelectedFiles([]);
        setMessages((prev) => [...prev, sentMsg]);
        if (socket.current) socket.current.emit("new message", sentMsg);

        // Sidebar update after sending
        setChats((prevChats) => {
          let updatedChats = prevChats.map((c) =>
            c._id === activeChat._id ? { ...c, latestMessage: sentMsg } : c,
          );
          const movedChat = updatedChats.find((c) => c._id === activeChat._id);
          updatedChats = updatedChats.filter((c) => c._id !== activeChat._id);
          return [movedChat, ...updatedChats];
        });
      }
    } catch (error) {
      console.error("Transmission failed", error);
      toast.error("Payload delivery failed. Check network.");
    }
  };

  // --- RADAR & 1-ON-1 CHAT HELPERS ---
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
  };

  const openChatInfo = () => {
    setIsChatInfoModalOpen(true);
  };

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
      const msgToDelete = messages.find((m) => m._id === messageId);
      await api.delete(`/messages/${messageId}`);

      setMessages(messages.filter((m) => m._id !== messageId));

      if (socket.current && msgToDelete) {
        socket.current.emit("message deleted", msgToDelete);
      }
    } catch (error) {
      toast.error("Purge failed!");
    }
  };

  const handleEditClick = (message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  };

  return (
    <div className="flex h-[100dvh] w-full relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111111] via-[#050505] to-[#000000] text-[#e0e0e0] font-mono antialiased selection:bg-[#b026ff]/30">
      {/* 🔥 MOBILE LAYOUT LOGIC 🔥 */}
      {/* SIDEBAR: Hidden on mobile if a chat is active, always visible on desktop */}
      <div
        className={`h-full flex-col shrink-0 border-r border-white/[0.05] ${activeChat ? "hidden md:flex" : "flex"} w-full md:w-[320px] lg:w-[380px]`}
      >
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
          onlineUsers={onlineUsers}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      </div>

      {/* CHATBOX: Hidden on mobile if NO chat is active, always visible on desktop */}
      <div
        className={`h-full flex-col flex-1 min-w-0 ${activeChat ? "flex" : "hidden md:flex"}`}
      >
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
          setActiveChat={setActiveChat}
          sendMessage={sendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          typingHandler={typingHandler}
          handleDeleteMessage={handleDeleteMessage}
          handleEditClick={handleEditClick}
          editingMessage={editingMessage}
          setEditingMessage={setEditingMessage}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          scrollToBottom={scrollToBottom}
        />
      </div>

      {/* MODALS */}
      <CreateGroup
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        chats={chats}
        setChats={setChats}
        setActiveChat={setActiveChat}
      />

      <ChatSettings
        isOpen={isChatInfoModalOpen}
        onClose={() => setIsChatInfoModalOpen(false)}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        chats={chats}
        setChats={setChats}
        currentUser={currentUser}
      />

      <UserProfile
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ChatPage;
