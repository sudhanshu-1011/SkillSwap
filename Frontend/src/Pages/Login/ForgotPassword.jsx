import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/auth/forgot-password", { email });
            toast.success("Reset link sent to your email!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)", padding: "20px" }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card" 
                style={{ width: "100%", maxWidth: "450px", padding: "50px", textAlign: "center" }}
            >
                <Link to="/login" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "30px", fontSize: "0.9rem" }}>
                    <FaArrowLeft /> Back to Login
                </Link>
                
                <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Reset <span className="text-gradient">Password</span></h1>
                <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>Enter your email and we'll send you a link to reset your password.</p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Email Address</label>
                        <div style={{ position: "relative" }}>
                            <FaEnvelope style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dark)" }} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: "100%", padding: "12px 15px 12px 45px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "12px", color: "white", outline: "none" }}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ width: "100%", padding: "14px", borderRadius: "12px", fontSize: "1rem" }}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
