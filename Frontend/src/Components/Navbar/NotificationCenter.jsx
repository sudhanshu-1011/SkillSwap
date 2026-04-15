import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck, FiX, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";

const NotificationCenter = () => {
  const [requests, setRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("/request/getRequests");
      setRequests(data.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const endpoint = action === 'accept' ? '/request/acceptRequest' : '/request/rejectRequest';
      const { data } = await axios.post(endpoint, { requestID: requestId });
      toast.success(data.message);
      fetchRequests();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'white', 
          cursor: 'pointer', 
          position: 'relative',
          padding: '8px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FiBell size={24} color={requests.length > 0 ? "var(--primary)" : "white"} />
        {requests.length > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: '5px', 
            right: '5px', 
            width: '10px', 
            height: '100%', 
            maxHeight: '10px',
            background: 'var(--secondary)', 
            borderRadius: '50%',
            border: '2px solid var(--bg-main)'
          }} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="glass-card"
            style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '350px',
              maxHeight: '500px',
              overflowY: 'auto',
              zIndex: 1100,
              background: 'rgba(15, 23, 42, 0.98)',
              padding: '20px'
            }}
          >
            <h5 style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Notifications
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{requests.length} New</span>
            </h5>

            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dark)' }}>
                <FiInfo size={30} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>All caught up!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {requests.map((req) => (
                  <div key={req._id} style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                      <img src={req.sender.picture} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{req.sender.name}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>wants to swap skills</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleAction(req._id, 'accept')}
                        style={{ flex: 1, background: 'var(--primary)', border: 'none', color: 'white', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                      >
                        <FiCheck strokeWidth={3} /> Accept
                      </button>
                      <button 
                        onClick={() => handleAction(req._id, 'reject')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
