import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiClock, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const Feed = () => {
  const [logs, setLogs] = useState([]);
  const [content, setContent] = useState("");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFeed = async () => {
    try {
      const { data } = await axios.get("/user/community/feed");
      setLogs(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;
    try {
      setLoading(true);
      await axios.post("/user/community/log", { content, skill });
      setContent("");
      setSkill("");
      toast.success("Learning log shared! +10 Karma");
      fetchFeed();
    } catch (error) {
      toast.error("Failed to share log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '120px', paddingBottom: '60px' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Community <span className="text-gradient">Feed</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Share your progress and see what others are mastering.</p>
      </header>

      {/* Post Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ padding: '30px', marginBottom: '40px' }}
      >
        <form onSubmit={handleSubmit}>
          <textarea 
            placeholder="Today I learned..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control mb-3"
            style={{ fontSize: '1.1rem', minHeight: '120px' }}
          />
          <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
            <input 
              type="text" 
              placeholder="Skill (optional)" 
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="form-control"
              style={{ flex: 1 }}
            />
            <button 
              type="submit" 
              className="btn-primary d-flex align-items-center justify-content-center gap-2" 
              disabled={loading}
              style={{ minWidth: '180px' }}
            >
              {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <FiSend />}
              {loading ? "Posting..." : "Share Progress"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Feed Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={log._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card"
              style={{ padding: '24px', display: 'flex', gap: '20px' }}
            >
              <img 
                src={log.userPicture} 
                alt={log.userName} 
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-glass)' }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{log.userName}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{log.username}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dark)', fontSize: '0.8rem' }}>
                    <FiClock />
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                </div>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.5 }}>{log.content}</p>
                {log.skill && (
                  <span style={{ 
                    display: 'inline-block', 
                    marginTop: '15px', 
                    padding: '4px 12px', 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    color: 'var(--primary)', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem' 
                  }}>
                    #{log.skill}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;
