import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  // Al cargar, revisamos si hay datos guardados
  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    const savedToken = localStorage.getItem("token");
    if (userData) setUsuario(JSON.parse(userData));
    if (savedToken) setToken(savedToken);
  }, []);

  // Iniciar sesión (guardamos usuario y token)
  const login = (user, tokenValue) => {
    localStorage.setItem("usuarioLogueado", JSON.stringify(user));
    localStorage.setItem("token", tokenValue);
    setUsuario(user);
    setToken(tokenValue);
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);