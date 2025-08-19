import { useState } from "react";
import { useNavigate } from "react-router-dom";
// No necesitamos useAuth aquí, ya que no estamos iniciando sesión automáticamente.

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  
  // --- NUEVOS ESTADOS PARA UNA MEJOR EXPERIENCIA DE USUARIO ---
  const [loading, setLoading] = useState(false); // Para el estado de carga
  const [message, setMessage] = useState({ text: '', type: '' }); // Para mostrar mensajes (éxito/error)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Iniciar el estado de carga y limpiar mensajes anteriores
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password })
      });

      const data = await response.json();

      // Si la respuesta del servidor no es 'ok' (ej: error 409, 500), lanzamos un error
      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error desconocido.');
      }

      // 2. Si todo fue bien, mostramos el mensaje de éxito
      setMessage({
        text: '¡Registro exitoso! Se ha enviado un correo de bienvenida a tu bandeja de entrada.',
        type: 'success'
      });

      // 3. Después de unos segundos, redirigimos al login para que el usuario pueda leer el mensaje
      setTimeout(() => {
        navigate("/login");
      }, 3000); // 3 segundos de espera

    } catch (error) {
      // 4. Si hubo un error en la petición, lo mostramos
      setMessage({
        text: error.message,
        type: 'error'
      });
    } finally {
      // 5. Quitar el estado de carga, ya sea que la petición haya sido exitosa o fallida
      setLoading(false);
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

        {/* --- COMPONENTE DE MENSAJES (REEMPLAZA AL ALERT) --- */}
        {message.text && (
          <div 
            className={`p-4 mb-4 text-sm rounded-lg text-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

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
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
            disabled={loading} // Deshabilitado mientras carga
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
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
            disabled={loading} // Deshabilitado mientras carga
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
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
            disabled={loading} // Deshabilitado mientras carga
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
          disabled={loading} // Deshabilitado mientras carga
        >
          {loading ? 'Registrando...' : 'Registrarse'}
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