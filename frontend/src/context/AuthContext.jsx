import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // ✅ SAFE USER
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser || storedUser === "undefined") return null;

      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Invalid user in localStorage:", err);
      return null;
    }
  });

  // ✅ SAFE TOKEN
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // ✅ LOGIN
  const login = (data) => {
    if (!data?.user || !data?.token) {
      console.error("Invalid login data:", data);
      return;
    }

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);