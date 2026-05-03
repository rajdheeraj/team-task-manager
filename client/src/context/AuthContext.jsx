import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // 🔥 Ensure _id always exists
      return {
        ...parsed,
        _id: parsed._id || parsed.id,
      };
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    // 🔥 Fix mismatch between id and _id
    const fixedUser = {
      ...userData,
      _id: userData._id || userData.id,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(fixedUser));
    setUser(fixedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);