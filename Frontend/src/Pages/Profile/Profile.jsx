import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import { FiGithub, FiLinkedin, FiExternalLink, FiAward, FiCheckCircle, FiActivity } from "react-icons/fi";
import Box from "./Box";

const Profile = () => {
  const { user, setUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/user/registered/getDetails/${username}`);
        setProfileUser(data.data);
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 401) {
          localStorage.removeItem("userInfo");
          setUser(null);
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username]);

  const convertDate = (dateTimeString) => {
    if (!dateTimeString) return "Present";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const connectHandler = async () => {
    try {
      setConnectLoading(true);
      const { data } = await axios.post(`/request/create`, { receiverID: profileUser._id });
      toast.success(data.message);
      setProfileUser(prev => ({ ...prev, status: "Pending" }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Connection failed");
    } finally {
      setConnectLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header Profile Section */}
        <section className="glass-card" style={{ padding: '40px', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--primary)', boxShadow: '0 0 30px var(--primary-glow)' }}>
              <img src={profileUser?.picture} alt={profileUser?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {profileUser?.isVerified && (
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--bg-main)', borderRadius: '50%', padding: '4px' }}>
                <FiCheckCircle size={32} color="#22c55e" />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{profileUser?.name}</h1>
              <div className="glass" style={{ padding: '5px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent)' }}>
                <FiAward color="var(--accent)" />
                <span style={{ fontWeight: '700', color: 'var(--accent)' }}>{profileUser?.karma || 0} Karma</span>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px' }}>@{profileUser?.username}</p>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {user?.username !== username && (
                <button 
                  className={profileUser?.status === "Connect" ? "btn-primary" : "glass"}
                  onClick={profileUser?.status === "Connect" ? connectHandler : undefined}
                  style={{ padding: '12px 30px', borderRadius: '12px', minWidth: '140px' }}
                >
                  {connectLoading ? <Spinner size="sm" /> : profileUser?.status}
                </button>
              )}
              {user?.username === username && (
                <Link to="/edit_profile" style={{ textDecoration: 'none' }}>
                  <button className="glass" style={{ padding: '12px 30px', borderRadius: '12px', color: 'white' }}>Edit Profile</button>
                </Link>
              )}
              
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                <a href={profileUser?.githubLink} target="_blank" className="glass" style={{ padding: '12px', borderRadius: '12px', color: 'white' }}><FiGithub size={20} /></a>
                <a href={profileUser?.linkedinLink} target="_blank" className="glass" style={{ padding: '12px', borderRadius: '12px', color: 'white' }}><FiLinkedin size={20} /></a>
                <a href={profileUser?.portfolioLink} target="_blank" className="glass" style={{ padding: '12px', borderRadius: '12px', color: 'white' }}><FiExternalLink size={20} /></a>
              </div>
            </div>
          </div>
        </section>

        <div className="row g-4">
          <div className="col-12 col-lg-7 d-flex flex-column gap-4">
            {/* Bio Section */}
            <section>
              <h2 className="mb-3 d-flex align-items-center gap-2">
                <FiUser /> Biography
              </h2>
              <div className="glass-card p-4">
                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>{profileUser?.bio}</p>
              </div>
            </section>

            {/* Projects Section */}
            <section>
              <h2 className="mb-3 d-flex align-items-center gap-2">
                <FiActivity /> Featured Projects
              </h2>
              <div className="d-flex flex-column gap-3">
                {profileUser?.projects?.map((item, i) => (
                  <Box 
                    key={i}
                    head={item.title}
                    desc={item.description}
                    date={`${convertDate(item.startDate)} - ${convertDate(item.endDate)}`}
                    skills={item.techStack}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="col-12 col-lg-5 d-flex flex-column gap-4">
            {/* Skills Section */}
            <section>
              <h2 className="mb-3">Skills & Expertise</h2>
              <div className="glass-card p-4">
                <h6 className="text-uppercase mb-3" style={{ color: 'var(--text-dark)', fontSize: '0.75rem', letterSpacing: '1px' }}>Proficient At</h6>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {profileUser?.skillsProficientAt?.map((s, i) => (
                    <span key={i} className="glass px-3 py-2 rounded-pill" style={{ fontSize: '0.9rem', border: '1px solid var(--primary)' }}>{s}</span>
                  ))}
                </div>
                
                <h6 className="text-uppercase mb-3" style={{ color: 'var(--text-dark)', fontSize: '0.75rem', letterSpacing: '1px' }}>Wants to Learn</h6>
                <div className="d-flex flex-wrap gap-2">
                  {profileUser?.skillsToLearn?.map((s, i) => (
                    <span key={i} className="glass px-3 py-2 rounded-pill" style={{ fontSize: '0.9rem', border: '1px solid var(--secondary)' }}>{s}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Education Section */}
            <section>
              <h2 className="mb-3">Education</h2>
              <div className="d-flex flex-column gap-3">
                {profileUser?.education?.map((item, i) => (
                  <Box 
                    key={i}
                    head={item.institution}
                    spec={item.degree}
                    date={`${convertDate(item.startDate)} - ${convertDate(item.endDate)}`}
                    score={item.score}
                  />
                ))}
              </div>
            </section>

            {/* Learning Logs Section */}
            {profileUser?.learningLogs?.length > 0 && (
              <section>
                <h2 className="mb-3">Recent Logs</h2>
                <div className="glass-card p-4 d-flex flex-column gap-3">
                   {profileUser.learningLogs.slice(-3).reverse().map((log, i) => (
                     <div key={i} className={i < 2 ? 'pb-3 border-bottom border-light border-opacity-10' : ''}>
                        <span className="text-muted small">{convertDate(log.date)}</span>
                        <p className="mb-0 mt-1" style={{ fontSize: '0.95rem' }}>{log.content}</p>
                     </div>
                   ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
