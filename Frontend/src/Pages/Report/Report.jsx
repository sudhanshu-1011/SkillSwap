import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiUser, FiBriefcase, FiHelpCircle } from "react-icons/fi";

const issueOptions = [
  { value: "Personal conduct", label: "Personal Conduct", icon: <FiUser size={18} />, desc: "Inappropriate behavior or communication" },
  { value: "Professional expertise", label: "Professional Expertise", icon: <FiBriefcase size={18} />, desc: "Misrepresentation of skills or knowledge" },
  { value: "Others", label: "Other Issues", icon: <FiHelpCircle size={18} />, desc: "Any other concern not listed above" },
];

const ReportForm = () => {
  const { username } = useParams();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    reportedUsername: username || "",
    issue: "",
    issueDescription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.issue || !formData.issueDescription.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`/report/create`, formData);
      toast.success(data.message || "Report submitted successfully");
      setFormData((prev) => ({ ...prev, issue: "", issueDescription: "" }));
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Failed to submit report");
      if (msg === "Please Login") {
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-main)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "120px 20px 60px",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "25%", left: "50%", transform: "translateX(-50%)",
        width: "500px", height: "300px",
        background: "rgba(239, 68, 68, 0.08)",
        filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "560px" }}
      >
        {/* Header Card */}
        <div className="glass-card" style={{ padding: "32px 36px 0", marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#ef4444",
            }}>
              <FiAlertTriangle size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Report a User</h2>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
                Reporting <span style={{ color: "#ef4444", fontWeight: "600" }}>@{formData.reportedUsername || username}</span>
              </p>
            </div>
          </div>
          <p style={{ color: "var(--text-dark)", fontSize: "0.88rem", margin: "16px 0 0", lineHeight: 1.6, paddingBottom: "24px", borderBottom: "1px solid var(--border-subtle)" }}>
            All reports are taken seriously. Please provide accurate information to help us take appropriate action.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card" style={{
          padding: "32px 36px 36px",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderTop: "none",
        }}>
          <form onSubmit={handleSubmit}>
            {/* Reported Username (pre-filled, read-only) */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Username Being Reported</label>
              <input
                type="text"
                name="reportedUsername"
                className="form-control"
                value={formData.reportedUsername}
                onChange={handleChange}
                placeholder="Username"
                readOnly={!!username}
                style={{ opacity: username ? 0.7 : 1 }}
              />
            </div>

            {/* Issue Type */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "12px" }}>Nature of the Issue <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {issueOptions.map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => setFormData((prev) => ({ ...prev, issue: opt.value }))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 16px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${formData.issue === opt.value ? "#ef4444" : "var(--border-glass)"}`,
                      background: formData.issue === opt.value ? "rgba(239, 68, 68, 0.08)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      transition: "var(--transition-smooth)",
                    }}
                  >
                    <input
                      type="radio"
                      name="issue"
                      value={opt.value}
                      checked={formData.issue === opt.value}
                      onChange={handleChange}
                      style={{
                        width: "16px !important",
                        height: "16px !important",
                        accentColor: "#ef4444",
                        flexShrink: 0,
                        border: "none !important",
                        background: "transparent !important",
                      }}
                    />
                    <div style={{
                      color: formData.issue === opt.value ? "#ef4444" : "var(--text-muted)",
                      flexShrink: 0,
                    }}>
                      {opt.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "2px" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-dark)" }}>
                        {opt.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Describe the Issue <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="issueDescription"
                className="form-control"
                placeholder="Please provide details about the incident. Be as specific as possible..."
                value={formData.issueDescription}
                onChange={handleChange}
                style={{ minHeight: "130px", resize: "vertical", fontSize: "0.95rem", lineHeight: 1.6 }}
              />
              <p style={{ fontSize: "0.78rem", color: "var(--text-dark)", margin: "6px 0 0" }}>
                {formData.issueDescription.length} characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                border: "none",
                color: "white",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "var(--transition-smooth)",
                boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
              }}
            >
              {loading ? (
                <><Spinner animation="border" size="sm" /> Submitting Report...</>
              ) : (
                <><FiAlertTriangle /> Submit Report</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportForm;
