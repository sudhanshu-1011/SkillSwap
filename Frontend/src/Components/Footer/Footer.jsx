import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin, FiZap } from "react-icons/fi";

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(20px)',
      padding: '60px 5% 30px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '800', fontSize: '1rem'
              }}>S</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.2rem', color: 'white', letterSpacing: '-1px' }}>
                SKILL<span className="text-gradient">SWAP</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '260px' }}>
              The premium platform for collaborative learning. Trade knowledge, grow together.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'var(--transition-smooth)',
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h6 style={{ color: 'var(--text-dark)', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Platform</h6>
            {['Discover', 'Community Feed', 'Messages', 'About Us'].map((item, i) => {
              const paths = ['/discover', '/feed', '/chats', '/about_us'];
              return (
                <Link key={i} to={paths[i]} style={{
                  display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem',
                  marginBottom: '10px', transition: 'var(--transition-smooth)'
                }}
                  onMouseOver={e => e.target.style.color = 'white'}
                  onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</Link>
              );
            })}
          </div>

          {/* Account links */}
          <div>
            <h6 style={{ color: 'var(--text-dark)', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Account</h6>
            {['Login', 'Register', 'Edit Profile'].map((item, i) => {
              const paths = ['/login', '/register', '/edit_profile'];
              return (
                <Link key={i} to={paths[i]} style={{
                  display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem',
                  marginBottom: '10px', transition: 'var(--transition-smooth)'
                }}
                  onMouseOver={e => e.target.style.color = 'white'}
                  onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
                >{item}</Link>
              );
            })}
          </div>

          {/* CTA */}
          <div>
            <h6 style={{ color: 'var(--text-dark)', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Get Started</h6>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>
              Join thousands of learners swapping skills today.
            </p>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiZap size={14} /> Join Free
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ margin: 0, color: 'var(--text-dark)', fontSize: '0.85rem' }}>
            © 2024 <span style={{ color: 'var(--text-muted)' }}>SkillSwap</span>. All rights reserved.
          </p>
          <p style={{ margin: 0, color: 'var(--text-dark)', fontSize: '0.85rem' }}>
            Made with <span style={{ color: '#ef4444' }}>♥</span> for the learning community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
