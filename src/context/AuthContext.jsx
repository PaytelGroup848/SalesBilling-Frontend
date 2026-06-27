import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi } from "../api/auth.api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);

        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("AuthContext - JSON parse error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      // Clear any invalid data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log("AuthContext - login called with:", email);
    const data = await loginApi({ email, password });
    console.log("AuthContext - login response:", data);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
