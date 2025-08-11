import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, password })
    });
    const data = await response.json();
    if (response.ok) {
      if (data.token) {
        login({ nombre: data.nombre, correo: data.correo }, data.token);
        navigate("/");
      } else {
        alert('Usuario registrado, ahora puedes iniciar sesión');
        navigate("/login");
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Crear Cuenta
        </h3>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input 
            id="nombre"
            type="text" 
            placeholder="Tu nombre" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="correo">
            Correo electrónico
          </label>
          <input 
            id="correo"
            type="email" 
            placeholder="ejemplo@correo.com" 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
            Contraseña
          </label>
          <input 
            id="password"
            type="password" 
            placeholder="********" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Registrarse
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <span 
            onClick={() => navigate("/login")} 
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Inicia sesión aquí
          </span>
        </p>
      </form>
    </div>
  );
}