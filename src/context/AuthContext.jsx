// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // Al cargar, revisamos si hay datos guardados
  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    const savedToken = localStorage.getItem("token");

    if (userData) setUsuario(JSON.parse(userData));
    if (savedToken) {
      setToken(savedToken);
      checkTokenExpiration(savedToken); // Verifica si ya expiró
    }
  }, []);

  // Iniciar sesión (guardamos usuario y token)
  const login = (user, tokenValue) => {
    localStorage.setItem("usuarioLogueado", JSON.stringify(user));
    localStorage.setItem("token", tokenValue);
    setUsuario(user);
    setToken(tokenValue);
    checkTokenExpiration(tokenValue); // arranca el temporizador de expiración
  };

  // Verificar expiración del token
  const checkTokenExpiration = (tokenValue) => {
    try {
      const decoded = jwtDecode(tokenValue);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
        navigate("/login");
      } else {
        // Limpia timeout previo si existe
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const tiempoRestante = decoded.exp * 1000 - Date.now();
        timeoutRef.current = setTimeout(() => {
          logout();
          navigate("/login");
        }, tiempoRestante);
      }
    } catch (e) {
      logout();
      navigate("/login");
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 👇 Hook separado (export function en vez de const) → evita error de Vite
export function useAuth() {
  return useContext(AuthContext);
}