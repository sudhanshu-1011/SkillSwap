import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCenter from "./NotificationCenter";

const Header = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    try {
      await axios.get("/auth/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = user 
    ? [
        { name: "Discover", path: "/discover" },
        { name: "Community", path: "/feed" },
        { name: "Messages", path: "/chats" },
      ]
    : [
        { name: "About", path: "/about_us" },
        { name: "Why SkillSwap", path: "/#why-skill-swap" },
      ];

  return (
    <header 
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px',
        zIndex: 1000,
        transition: 'var(--transition-smooth)',
      }}
    >
      <nav className="glass" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isScrolled ? '12px 30px' : '18px 40px',
        borderRadius: '24px',
        background: isScrolled ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.4)',
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.3)' : 'none',
        transition: 'var(--transition-smooth)',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '35px',
            height: '35px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '800'
          }}>S</div>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: '800', 
            fontSize: '1.4rem', 
            color: 'white',
            letterSpacing: '-1px'
          }}>
            SKILL<span className="text-gradient">SWAP</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                style={{
                  color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseOver={(e) => e.target.style.color = 'white'}
                onMouseOut={(e) => e.target.style.color = location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)'}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user && <NotificationCenter />}
            <div style={{ width: '1px', height: '20px', background: 'var(--border-glass)' }} />
          </div>

          {/* User Section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-glass)' }}>
                  <img src={user.picture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="glass-card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '60px',
                      width: '200px',
                      padding: '10px',
                      background: 'rgba(15, 23, 42, 0.95)',
                      zIndex: 1001
                    }}
                  >
                    <div 
                      onClick={() => { navigate(`/profile/${user.username}`); setShowDropdown(false); }}
                      style={{ padding: '12px', borderRadius: '10px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      Profile
                    </div>
                    <div 
                      onClick={handleLogout}
                      style={{ padding: '12px', borderRadius: '10px', cursor: 'pointer', color: '#ff4444' }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(255,0,0,0.05)'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              className="btn-primary" 
              onClick={() => navigate('/login')}
              style={{ padding: '10px 25px', fontSize: '0.9rem' }}
            >
              Get Started
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
