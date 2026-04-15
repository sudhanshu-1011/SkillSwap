import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../util/UserContext";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (review.trim() === "") {
      toast.error("Please enter a review");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`/rating/rateUser`, {
        rating,
        description: review,
        username: username || user?.username,
      });
      toast.success(data.message);
      setRating(0);
      setReview("");
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(msg || "Rating submission failed");
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

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-main)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "100px",
      paddingBottom: "60px",
      padding: "120px 20px 60px",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "500px", height: "300px",
        background: "rgba(139, 92, 246, 0.15)",
        filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ width: "100%", maxWidth: "480px", padding: "48px 40px", position: "relative" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(139, 92, 246, 0.2))",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", fontSize: "1.8rem",
          }}>
            ⭐
          </div>
          <h2 style={{ marginBottom: "8px" }}>
            Rate Your <span className="text-gradient">Experience</span>
          </h2>
          {username && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Rating <span style={{ color: "var(--primary)", fontWeight: "600" }}>@{username}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", marginBottom: "12px", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>
              Your Rating
            </label>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "10px" }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    transition: "transform 0.15s ease",
                    transform: hovered >= value || rating >= value ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <FiStar
                    size={36}
                    fill={(hovered || rating) >= value ? "#f59e0b" : "transparent"}
                    color={(hovered || rating) >= value ? "#f59e0b" : "var(--text-dark)"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <p style={{
                textAlign: "center", fontSize: "0.9rem", fontWeight: "600",
                color: "#f59e0b", margin: 0, transition: "var(--transition-smooth)"
              }}>
                {ratingLabels[hovered || rating]}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>
              Write a Review
            </label>
            <textarea
              placeholder="Share your experience — what did you learn? How was the session?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="form-control"
              style={{ minHeight: "130px", resize: "vertical", fontSize: "0.95rem", lineHeight: 1.6 }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
            style={{ padding: "14px", fontSize: "1rem" }}
          >
            {loading ? (
              <><Spinner animation="border" size="sm" /> Submitting...</>
            ) : (
              <>⭐ Submit Rating</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Rating;
