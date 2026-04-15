import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const UserContext = createContext();

const PUBLIC_PATHS = ["/", "/login", "/register", "/about_us", "/discover", "/forgot-password"];

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfoString = localStorage.getItem("userInfo");
        if (userInfoString && userInfoString !== "undefined") {
          const userInfo = JSON.parse(userInfoString);
          setUser(userInfo);
        } else {
          // If no userInfo in localStorage, try fetching from backend (checks cookies)
          const { data } = await axios.get("/user/registered/getDetails");
          if (data?.data) {
            setUser(data.data);
            localStorage.setItem("userInfo", JSON.stringify(data.data));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("userInfo");
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
    };

    fetchUser();
  }, [location.pathname]);


  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserContextProvider, useUser };
