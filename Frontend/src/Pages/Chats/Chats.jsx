import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../util/UserContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCalendar, FiMoreVertical, FiSearch, FiArrowLeft, FiClock } from "react-icons/fi";
import { Spinner } from "react-bootstrap";

let socket;

const Chats = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const scrollRef = useRef();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: "", time: "" });

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    socket = io(axios.defaults.baseURL);
    if (user) socket.emit("setup", user);
    
    socket.on("message recieved", (newMessage) => {
      if (selectedChat && selectedChat.id === newMessage.chatId._id) {
        setChatMessages(prev => [...prev, newMessage]);
      }
    });

    return () => socket.off("message recieved");
  }, [selectedChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/chat");
      const formatted = data.data.map(chat => {
        const otherUser = chat.users.find(u => u._id !== user?._id);
        return {
          id: chat._id,
          name: otherUser?.name,
          picture: otherUser?.picture,
          username: otherUser?.username
        };
      });
      setChats(formatted);
    } catch (err) {
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = async (chat) => {
    try {
      setMessageLoading(true);
      const { data } = await axios.get(`/message/getMessages/${chat.id}`);
      setChatMessages(data.data);
      setSelectedChat(chat);
      socket.emit("join chat", chat.id);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setMessageLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    try {
      const { data } = await axios.post("/message/sendMessage", {
        chatId: selectedChat.id,
        content: message
      });
      socket.emit("new message", data.data);
      setChatMessages(prev => [...prev, data.data]);
      setMessage("");
    } catch (err) {
      toast.error("Message send failed");
    }
  };

  const requestMeeting = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/sendScheduleMeet", {
        ...scheduleForm,
        username: selectedChat.username
      });
      toast.success("Meeting request sent!");
      setShowSchedule(false);
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  return (
    <div style={{ height: '100vh', paddingTop: '100px', paddingBottom: '20px', background: 'var(--bg-main)', display: 'flex', justifyContent: 'center' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2px', background: 'var(--border-glass)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-glass)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
        
        {/* Sidebar */}
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '25px', borderBottom: '1px solid var(--border-glass)' }}>
            <h3 style={{ marginBottom: '20px' }}>Messages</h3>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dark)' }} />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'white', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}><Spinner animation="border" variant="primary" /></div>
            ) : chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => handleChatSelect(chat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  background: selectedChat?.id === chat.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  transition: 'all 0.3s ease',
                  border: selectedChat?.id === chat.id ? '1px solid var(--primary-glow)' : '1px solid transparent'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={chat.picture} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', border: '2px solid #0f172a' }} />
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: '600' }}>{chat.name}</h6>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dark)' }}>@{chat.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{ background: 'rgba(15, 23, 42, 0.2)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <>
              {/* Header */}
              <div style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={selectedChat.picture} alt="" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                  <div>
                    <h6 style={{ margin: 0 }}>{selectedChat.name}</h6>
                    <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>Online</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowSchedule(true)} className="glass" style={{ padding: '8px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    <FiCalendar /> Request Swap
                  </button>
                  <button className="glass" style={{ padding: '8px', borderRadius: '10px', color: 'white' }}><FiMoreVertical /></button>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messageLoading ? (
                   <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50%' }}><Spinner animation="border" /></div>
                ) : (
                  chatMessages.map((m, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        alignSelf: m.sender._id === user._id ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: m.sender._id === user._id ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ 
                        padding: '12px 18px', 
                        borderRadius: m.sender._id === user._id ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: m.sender._id === user._id ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
                        border: m.sender._id === user._id ? 'none' : '1px solid var(--border-glass)',
                        color: 'white',
                        boxShadow: m.sender._id === user._id ? '0 10px 20px rgba(99, 102, 241, 0.2)' : 'none'
                      }}>
                        {m.content}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-dark)', marginTop: '5px' }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={sendMessage} style={{ padding: '20px 30px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..." 
                    style={{ flex: 1, padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '14px', color: 'white', outline: 'none' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiSend size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-dark)' }}>
               <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                  <FiSend size={40} />
               </div>
               <h3>Your Messages</h3>
               <p>Select a person to start a conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Meeting Request Modal */}
      <AnimatePresence>
        {showSchedule && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSchedule(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card" style={{ position: 'relative', width: '400px', padding: '40px', zIndex: 2001 }}>
              <h3 style={{ marginBottom: '25px' }}>Request Meeting</h3>
              <form onSubmit={requestMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date</label>
                  <input type="date" required value={scheduleForm.date} onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '10px', color: 'white' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time</label>
                  <input type="time" required value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '10px', color: 'white' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px' }}>Send Request</button>
                  <button type="button" onClick={() => setShowSchedule(false)} className="glass" style={{ padding: '12px 20px', borderRadius: '10px', color: 'white' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chats;
