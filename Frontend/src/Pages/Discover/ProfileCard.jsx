import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProfileCard = ({ profileImageUrl, bio, name, skills, rating, username, isPerfectMatch }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-card" 
      style={{ 
        width: '300px', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
        gap: '16px',
        position: 'relative',
        border: isPerfectMatch ? '1px solid var(--accent)' : '1px solid var(--border-glass)'
      }}
    >
      {isPerfectMatch && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}>
          Perfect Match
        </div>
      )}

      <div style={{ 
        width: '100px', 
        height: '100px', 
        borderRadius: '50%', 
        overflow: 'hidden', 
        border: `3px solid ${isPerfectMatch ? 'var(--accent)' : 'var(--primary)'}`,
        boxShadow: isPerfectMatch ? '0 0 25px var(--accent)' : '0 0 20px var(--primary-glow)'
      }}>
        <img src={profileImageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{name}</h3>
        <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
          {'★'.repeat(Math.round(rating || 5)) + '☆'.repeat(5 - Math.round(rating || 5))}
          <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>({rating || 5})</span>
        </div>
      </div>

      <p style={{ 
        fontSize: '0.9rem', 
        color: 'var(--text-muted)', 
        height: '40px', 
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {bio || "Experienced learner and mentor in the SkillSwap community."}
      </p>

      <div style={{ width: '100%' }}>
        <h6 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dark)', marginBottom: '10px', textAlign: 'left' }}>
          Expertise
        </h6>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
          {skills && skills.slice(0, 3).map((skill, index) => (
            <span key={index} style={{ 
              fontSize: '0.7rem', 
              padding: '4px 10px', 
              background: isPerfectMatch ? 'rgba(139, 92, 246, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
              color: isPerfectMatch ? 'var(--accent)' : 'var(--primary)', 
              borderRadius: '20px',
              border: isPerfectMatch ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              {skill}
            </span>
          ))}
          {skills && skills.length > 3 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{skills.length - 3} more</span>
          )}
        </div>
      </div>

      <Link to={`/profile/${username}`} style={{ width: '100%', textDecoration: 'none' }}>
        <button className={isPerfectMatch ? "btn-primary" : "glass"} style={{ 
          width: '100%', 
          padding: '10px', 
          borderRadius: '12px', 
          color: 'white', 
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '8px'
        }}>
          {isPerfectMatch ? "Connect Now" : "View Profile"}
        </button>
      </Link>
    </motion.div>
  );
};

export default ProfileCard;
