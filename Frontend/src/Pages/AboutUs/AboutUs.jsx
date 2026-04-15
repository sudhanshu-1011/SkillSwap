import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiTarget, FiHeart, FiZap } from "react-icons/fi";

const stats = [
  { label: "Active Learners", value: "10K+", icon: "👥" },
  { label: "Skills Shared", value: "500+", icon: "🎯" },
  { label: "Countries", value: "40+", icon: "🌍" },
  { label: "Connections Made", value: "25K+", icon: "🤝" },
];

const team = [
  {
    name: "Knowledge Exchange",
    description: "We believe every person has something unique to teach. Our platform turns expertise into opportunity.",
    icon: <FiUsers size={28} />,
  },
  {
    name: "Zero Barriers",
    description: "No paywalls, no fees. SkillSwap is and will always be free — because learning should never be gated.",
    icon: <FiHeart size={28} />,
  },
  {
    name: "Real Growth",
    description: "Build real-world skills through practical, hands-on collaboration with talented individuals worldwide.",
    icon: <FiTarget size={28} />,
  },
  {
    name: "Community First",
    description: "Every feature we build is driven by community needs. You shape what SkillSwap becomes.",
    icon: <FiZap size={28} />,
  },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: "var(--bg-main)", minHeight: "100vh", paddingTop: "100px" }}>
      {/* Hero */}
      <section style={{ padding: "80px 5% 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "400px",
          background: "var(--primary-glow)",
          filter: "blur(120px)",
          borderRadius: "50%",
          zIndex: 0,
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span style={{
              display: "inline-block",
              padding: "6px 18px",
              background: "rgba(79, 70, 229, 0.15)",
              border: "1px solid rgba(79, 70, 229, 0.3)",
              borderRadius: "24px",
              fontSize: "0.8rem",
              color: "var(--primary)",
              fontWeight: "700",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}>
              Our Story
            </span>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.15, marginBottom: "24px" }}>
              Built for <span className="text-gradient">Learners</span>,
              <br /> By Learners
            </h1>
            <p style={{
              color: "var(--text-muted)", fontSize: "1.2rem",
              maxWidth: "700px", margin: "0 auto 40px",
              lineHeight: 1.8,
            }}>
              As students, we searched everywhere for ways to upskill — only to hit paywalls. 
              We built SkillSwap so no one faces that barrier again. Learn by teaching, 
              grow by sharing, connect while you collaborate.
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
              style={{ padding: "14px 32px", fontSize: "1rem" }}
            >
              Join the Movement
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: "0 5% 80px" }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
              style={{ padding: "30px", textAlign: "center" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{stat.icon}</div>
              <div style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "white", marginBottom: "6px" }}>
                {stat.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "500" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission / Values */}
      <section style={{ padding: "60px 5% 80px", background: "rgba(15, 23, 42, 0.5)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.8rem", marginBottom: "16px" }}>
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
              Our values aren't just words — they guide every decision we make.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {team.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ padding: "36px" }}
              >
                <div style={{
                  width: "56px", height: "56px",
                  borderRadius: "16px",
                  background: "rgba(79, 70, 229, 0.15)",
                  border: "1px solid rgba(79, 70, 229, 0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--primary)",
                  marginBottom: "20px",
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>{item.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section style={{ padding: "80px 5%" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="glass-card" style={{
            padding: "60px 50px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(139, 92, 246, 0.08))",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "200px", height: "200px",
              background: "var(--primary-glow)",
              filter: "blur(80px)",
              borderRadius: "50%",
            }} />
            <h2 style={{ fontSize: "2rem", marginBottom: "20px", position: "relative" }}>Our Mission</h2>
            <p style={{
              fontSize: "1.15rem",
              color: "var(--text-muted)",
              lineHeight: 1.9,
              maxWidth: "700px",
              margin: "0 auto 30px",
              position: "relative"
            }}>
              To empower individuals to unlock their full potential through skill sharing.
              By facilitating meaningful interactions and fostering a culture of lifelong learning,
              we aim to create a community where everyone has the opportunity to thrive — 
              regardless of their background or resources.
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("/discover")}
              style={{ padding: "13px 30px", position: "relative" }}
            >
              Explore the Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
