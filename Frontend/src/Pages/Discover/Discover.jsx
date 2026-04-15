import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import ProfileCard from "./ProfileCard";
import { FiSearch, FiFilter, FiUser, FiCode, FiCpu, FiPlusCircle } from "react-icons/fi";

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Perfect Matches");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState({
    perfectMatches: [],
    recommended: [],
    webDev: [],
    ml: [],
    others: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: userData } = await axios.get(`/user/registered/getDetails`);
        if (userData && userData.data) {
          setUser(userData.data);
          localStorage.setItem("userInfo", JSON.stringify(userData.data));
        }

        const { data: discoverData } = await axios.get("/user/discover");
        setUsers({
          perfectMatches: discoverData.data.perfectMatches || [],
          recommended: discoverData.data.forYou || [],
          webDev: discoverData.data.webDev || [],
          ml: discoverData.data.ml || [],
          others: discoverData.data.others || []
        });
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: "Perfect Matches", icon: <FiFilter />, key: "perfectMatches" },
    { name: "Recommended", icon: <FiUser />, key: "recommended" },
    { name: "Web Development", icon: <FiCode />, key: "webDev" },
    { name: "AI & ML", icon: <FiCpu />, key: "ml" },
    { name: "Others", icon: <FiPlusCircle />, key: "others" },
  ];

  const getActiveUsers = () => {
    const key = categories.find(c => c.name === activeCategory)?.key || "recommended";
    const userList = users[key];
    if (!searchQuery) return userList;
    return userList.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.skillsProficientAt.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div className="container-fluid" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="row justify-content-center">
        {/* Categories Sidebar */}
        <aside className="col-lg-3 col-xl-2 d-none d-lg-flex flex-column gap-2 mb-4" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <h4 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px', fontWeight: '600' }}>
            Explore Skills
          </h4>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className="glass d-flex align-items-center gap-3 w-100 text-start"
              style={{
                padding: '12px 18px',
                border: activeCategory === cat.name ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                background: activeCategory === cat.name ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                color: activeCategory === cat.name ? 'var(--primary)' : 'var(--text-main)',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'var(--transition-smooth)'
              }}
            >
              {cat.icon}
              <span className="ms-1">{cat.name}</span>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="col-12 col-lg-9 col-xl-8">
          {/* Search & Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-4 rounded-4" style={{ 
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div className="mb-3 mb-md-0">
              <h1 className="fw-bold mb-2">{activeCategory}</h1>
              <p className="text-muted mb-0 small">Find your perfect skill swap partner today.</p>
            </div>
            <div className="glass d-flex align-items-center" style={{
              padding: '10px 16px',
              gap: '12px',
              width: '100%',
              maxWidth: '350px'
            }}>
              <FiSearch className="text-muted" />
              <input 
                type="text" 
                placeholder="Search skills or names..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* Categories Mobile Toggle (Standard bootstrap utility) */}
          <div className="d-lg-none d-flex overflow-auto pb-3 mb-3 gap-2" style={{ whiteSpace: 'nowrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className="btn btn-sm d-flex align-items-center gap-2"
                style={{
                  background: activeCategory === cat.name ? 'var(--primary)' : 'var(--bg-glass)',
                  color: activeCategory === cat.name ? '#fff' : 'var(--text-main)',
                  border: `1px solid ${activeCategory === cat.name ? 'var(--primary)' : 'var(--border-glass)'}`,
                  borderRadius: '20px',
                  padding: '8px 16px'
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className="row g-4">
              <AnimatePresence mode="popLayout">
                {getActiveUsers().length > 0 ? (
                  getActiveUsers().map((u, i) => (
                    <motion.div
                      key={u._id || i}
                      className="col-12 col-md-6 col-xl-4 d-flex justify-content-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ProfileCard 
                        profileImageUrl={u.picture}
                        name={u.name}
                        rating={u.rating || 5}
                        bio={u.bio}
                        skills={u.skillsProficientAt}
                        username={u.username}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <h2 className="text-muted fw-semibold">No experts found for this match.</h2>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Discover;
