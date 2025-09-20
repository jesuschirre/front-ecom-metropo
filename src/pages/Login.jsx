import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(
          { id: data.id, nombre: data.nombre, correo: data.correo, rol: data.rol },
          data.token
        );
        navigate("/");
      } else {
          Swal.fire({ 
          title: "Error" , 
          text: data.error || "Error al iniciar sesión", 
          icon: "error", 
          confirmButtonText: "Cerrar" 
        });
      }
    } catch (err) {
        Swal.fire({ 
          title: "Error" , 
          text: "No se pudo conectar con el servidor", 
          icon: "error", 
          confirmButtonText: "Cerrar" 
        });
    }
  };

  return (
    <div className="flex w-full h-screen bg-black ">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl px-8 pt-6 pb-8 w-full max-w-md "
        >
          <h1 className="text-5xl font-semibold text-center text-gray-800 mb-6">
            Iniciar sesión
          </h1>
          <p className="font-medium text-lg text-gray-500 mt-4 ">Bienvenido devuelta introduce tus credenciales</p>
          <div className="mt-7">
            <label className="text-lg font-medium">Correo</label>
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 mt-1 bg-transparent mb-4"
            />
            <label className="text-lg font-medium">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 mt-1 bg-transparent"
            />
            <button
              type="submit"
              className="font-mono mt-6 w-full bg-amber-400 rounded-xl text-white text-lg py-3 hover:bg-amber-500 transition cursor-pointer"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
      <div className="hidden relative lg:flex h h-full w-1/2 items-center justify-center bg-gray-200">
          <div className="w-60 h-60 bg-gradient-to-tr from-amber-500 to-pink-500 rounded-full animate-spin"/>
          <div className="w-full h-1/2 absolute bg-white/10 bottom-0 backdrop-blur-lg"/>
      </div>
    </div>
  );
}