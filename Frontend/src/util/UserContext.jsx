import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserContext = createContext();

const PUBLIC_PATHS = ["/", "/login", "/register", "/about_us", "/discover", "/forgot-password"];

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString && userInfoString !== "undefined") {
      try {
        const userInfo = JSON.parse(userInfoString);
        setUser(userInfo);
      } catch (error) {
        console.error("Error parsing userInfo:", error);
        localStorage.removeItem("userInfo");
        setUser(null);
      }
    } else {
      setUser(null);
      const isPublic =
        PUBLIC_PATHS.some((p) => location.pathname === p) ||
        location.pathname.startsWith("/reset-password/") ||
        location.pathname.startsWith("/profile/") ||
        location.pathname.startsWith("/report/") ||
        location.pathname.startsWith("/rating/");
      if (!isPublic) {
        navigate("/login");
      }
    }
  }, [location.pathname]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserContextProvider, useUser };
