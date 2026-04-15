import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        try {
            setLoading(true);
            await axios.post(`/auth/reset-password/${token}`, { password });
            toast.success("Password reset successful! Please login.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password");
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
                <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Set New <span className="text-gradient">Password</span></h1>
                <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>Please enter your new password below.</p>

                <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>New Password</label>
                        <div style={{ position: "relative" }}>
                            <FaLock style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dark)" }} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: "100%", padding: "12px 15px 12px 45px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "12px", color: "white", outline: "none" }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Confirm Password</label>
                        <div style={{ position: "relative" }}>
                            <FaLock style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dark)" }} />
                            <input 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: "100%", padding: "12px 15px 12px 45px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "12px", color: "white", outline: "none" }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ width: "100%", padding: "14px", borderRadius: "12px", fontSize: "1rem" }}
                        disabled={loading}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
