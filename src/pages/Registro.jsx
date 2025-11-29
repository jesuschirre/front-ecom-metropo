import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  // estado de carga
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación
    if (password.length < 8) {
      return Swal.fire({
        title: "Contraseña insegura",
        text: "La contraseña debe tener al menos 8 caracteres.",
        icon: "warning",
        confirmButtonText: "Cerrar"
      });
    }
    if (nombre === "" || correo === "" || password === "") {
      Swal.fire({ 
        title: "Error", 
        text: "Ingrese todos los campos", 
        icon: "error", 
        confirmButtonText: "Cerrar" 
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error desconocido.');
      }else{
        Swal.fire({ title: "¡Registro exitoso!", text: data.message, icon: "success", timer: 2000, showConfirmButton: false });
      }
      // Después de unos segundos, redirigimos al login para que el usuario pueda leer el mensaje
      setTimeout(() => {
        navigate("/login");
      }, 2000); // segundos de espera

    }catch (error) {
      Swal.fire({ 
        title: "Error", 
        text: error.message || "No se pudo registrar al usuario", 
        icon: "error", 
        confirmButtonText: "Cerrar" 
      });
    }
     finally {
      // Quitar el estado de carga, ya sea que la petición haya sido exitosa o fallida
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-black">
      <div className="w-full flex items-center justify-center lg:w-1/2">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white shadow-lg rounded-2xl px-8 pt-6 pb-8 w-full max-w-md"
          >
            <h3 className="text-5xl font-semibold text-center text-gray-800 mb-6">
              Crear Cuenta
            </h3>

            <div className="mb-4">
              <label className="text-lg font-medium" htmlFor="nombre">
                Nombre Completo
              </label>
              <input 
                id="nombre"
                type="text" 
                placeholder="Tu nombre" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                className="w-full border-2 border-gray-100 rounded-2xl p-4 mt-1 bg-transparent"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="text-lg font-medium" htmlFor="correo">
                Correo electrónico
              </label>
              <input 
                id="correo"
                type="email" 
                placeholder="ejemplo@correo.com" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                className="w-full border-2 border-gray-100 rounded-2xl p-4 mt-1 bg-transparent"
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="text-lg font-medium" htmlFor="password">
                Contraseña
              </label>
              <input 
                id="password"
                type="password" 
                placeholder="********" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full border-2 border-gray-100 rounded-2xl p-4 mt-1 bg-transparent"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-amber-400 rounded-xl text-white text-lg py-3 font-mono hover:bg-amber-500 transition cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <p className="mt-4 text-center text-lg text-gray-600">
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
      
      <div className="hidden relative lg:flex h h-full w-1/2 items-center justify-center bg-gray-200">
          <div className="w-60 h-60 bg-gradient-to-tr from-amber-500 to-pink-500 rounded-full animate-spin"/>
          <div className="w-full h-1/2 absolute bg-white/10 bottom-0 backdrop-blur-lg"/>
      </div>
    </div>
  );
}