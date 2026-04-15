import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUser } from "../../util/UserContext";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
      setUser(data.data.user);
      toast.success("Welcome back!");
      navigate("/discover");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)", padding: "20px" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card" 
        style={{ width: "100%", maxWidth: "420px", padding: "40px 30px", textAlign: "center" }}
      >
        <h2 className="fw-bold mb-2">Welcome <span className="text-gradient">Back</span></h2>
        <p className="text-muted mb-4 small">Continue your journey of mutual growth.</p>

        <form onSubmit={handleEmailLogin} className="text-start mb-4">
          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <div className="position-relative">
              <FaEnvelope className="position-absolute translate-middle-y text-muted" style={{ left: "15px", top: "50%" }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: "42px" }}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label text-muted small fw-semibold">Password</label>
            <div className="position-relative">
              <FaLock className="position-absolute translate-middle-y text-muted" style={{ left: "15px", top: "50%" }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: "42px" }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="text-end mb-4">
            <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "500" }}>Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-100 py-2 d-flex justify-content-center align-items-center" 
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="d-flex align-items-center gap-2 mb-4 text-muted small">
          <div className="flex-grow-1" style={{ height: "1px", background: "var(--border-glass)" }} />
          <span>OR</span>
          <div className="flex-grow-1" style={{ height: "1px", background: "var(--border-glass)" }} />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="btn btn-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2" 
        >
          <FaGoogle /> Login with Google
        </button>

        <p className="mt-4 mb-0 small text-muted">
          Don't have an account? <Link to="/register" style={{ color: "var(--secondary)", fontWeight: "600" }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
