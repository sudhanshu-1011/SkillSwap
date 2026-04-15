import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Learn From Experts",
      description: "Gain insights and practical knowledge directly from experienced mentors who excel in their respective fields.",
      icon: "🎓"
    },
    {
      title: "Share Your Expertise",
      description: "Have a skill or passion? Become a mentor, foster a sense of community, and help others grow.",
      icon: "🤝"
    },
    {
      title: "Collaborative Environment",
      description: "Connect with like-minded individuals, participate in group projects, and engage in discussions.",
      icon: "🚀"
    },
    {
      title: "Zero Cost Learning",
      description: "Skill Swap is entirely free. Swap your time and knowledge without financial barriers.",
      icon: "💎"
    }
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 5% 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'var(--primary-glow)',
          filter: 'blur(150px)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: 1.1, marginBottom: '24px' }}>
              Master Any Skill by <span className="text-gradient">Sharing Yours</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '600px' }}>
              The premium platform for collaborative learning. Connect with experts worldwide and trade knowledge in a community built on mutual growth.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/discover')}
                style={{ fontSize: '1.1rem', padding: '16px 40px' }}
              >
                Start Swapping
              </button>
              <button 
                className="glass" 
                onClick={() => navigate('/about_us')}
                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)', padding: '16px 40px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="animate-float"
          >
            <div className="glass-card" style={{ padding: '12px', borderRadius: '32px', position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                alt="SkillSwap Hero" 
                style={{ width: '100%', borderRadius: '24px', display: 'block', objectFit: 'cover', height: '400px' }} 
              />
              {/* Floating Badge */}
              <div className="glass" style={{
                position: 'absolute',
                bottom: '30px',
                left: '-20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                <span style={{ fontWeight: '600' }}>1.2k+ Experts Online</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 5%', background: 'rgba(15, 23, 42, 0.5)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Why <span className="text-gradient">SkillSwap?</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Experience the ultimate platform for skill acquisition and knowledge exchange.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card"
                style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div style={{ fontSize: '3rem' }}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 5%', position: 'relative' }}>
        <div className="glass-card" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '80px 40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '24px' }}>Ready to Grow Together?</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join thousands of learners and experts today. Start your journey of mutual mastery.
          </p>
          <button className="btn-primary" onClick={() => navigate('/register')} style={{ padding: '18px 60px', fontSize: '1.2rem' }}>
            Join the Community
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
