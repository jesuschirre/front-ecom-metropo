import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaUserCircle, FaEnvelope, FaTag, FaPhone, FaDirections } from 'react-icons/fa';
import { HiOutlineIdentification } from "react-icons/hi2";
import Swal from "sweetalert2";

export default function Perfil() {
  const [usuario, setUsuario] = useState({
    id: "",
    nombre: "",
    correo: "",
    tipo_documento: "",
    numero_documento: "",
    direccion: "",
    biografia: "",
    telefono: "",
    rol: ""
  });
  const [clienteInfo, setClienteInfo] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [loadingPlanes, setLoadingPlanes] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPerfil = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/perfil", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data && data.id) {
          setUsuario(data);
          if (data.rol === "cliente") {
            const resCliente = await fetch(`http://localhost:3000/api/cliente/usuario/${data.id}`);
            const info = await resCliente.json();
            setClienteInfo(info);
          }
        } else {
          console.error("Error al cargar perfil:", data);
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };

    const fetchPlanes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/planes");
        const data = await res.json();
        setPlanes(data);
      } catch (err) {
        console.error("Error al cargar planes:", err);
      } finally {
        setLoadingPlanes(false);
      }
    };

    fetchPerfil();
    fetchPlanes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      if (/^\d{0,9}$/.test(value)) {
        setUsuario({ ...usuario, [name]: value });
      }
      return;
    }

    if (name === "numero_documento") {
      if (/^\d{0,11}$/.test(value)) {
        setUsuario({ ...usuario, [name]: value });
      }
      return;
    }

    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usuario.telefono.length !== 9) {
      Swal.fire({
        title: "Teléfono inválido",
        text: "El número de teléfono debe tener exactamente 9 dígitos.",
        icon: "warning",
        confirmButtonText: "Corregir"
      });
      return;
    }

    if (usuario.numero_documento.length < 8 || usuario.numero_documento.length > 11) {
      Swal.fire({
        title: "DNI/RUC inválido",
        text: "El número de documento debe tener entre 8 y 11 dígitos.",
        icon: "warning",
        confirmButtonText: "Corregir"
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/users/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(usuario)
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          title: "¡Perfil actualizado!",
          text: data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "No se pudo actualizar el perfil",
          icon: "error",
          confirmButtonText: "Cerrar"
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error de conexión con el servidor",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-7 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="bg-[#232323] text-white rounded-3xl shadow-2xl p-8 lg:p-10 font-sans">
          <h1 className="font-bold text-xl mb-6">Edita Tu Perfil</h1>
          <hr className="my-4 border-t border-gray-700" />

          <div className="grid grid-cols-1 gap-10 mt-5">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nombre */}
                <div>
                  <label className="block text-lg font-semibold mb-1">Nombre / Razón Social</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={usuario.nombre}
                      onChange={handleChange}
                      placeholder="Tus Nombres"
                      className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-white rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-lg font-semibold mb-1">Dirección Fiscal</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaDirections className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="direccion"
                      value={usuario.direccion}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-white rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-lg font-semibold mb-1">Email</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="correo"
                      type="email"
                      name="correo"
                      value={usuario.correo}
                      onChange={handleChange}
                      placeholder="Correo Electrónico"
                      className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-white rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-lg font-semibold mb-1">Rol</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTag className="h-5 w-5" />
                    </div>
                    <input
                      id="rol"
                      type="text"
                      name="rol"
                      value={usuario.rol}
                      disabled
                      className="block w-full pl-10 pr-3 py-2 rounded-xl border-gray-300 bg-[#161616] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-lg font-semibold mb-1">Teléfono</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="telefono"
                      value={usuario.telefono}
                      onChange={handleChange}
                      placeholder="+51 999999999"
                      maxLength={9}
                      inputMode="numeric"
                      className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-white rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* DNI/RUC */}
                <div>
                  <label className="block text-lg font-semibold mb-1">Dni / Ruc</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineIdentification className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="numero_documento"
                      value={usuario.numero_documento}
                      onChange={handleChange}
                      placeholder="Número de documento"
                      maxLength={11}
                      inputMode="numeric"
                      className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-white rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Biografía */}
                <div className="md:col-span-2">
                  <label className="block text-lg font-semibold mb-1">Biografía</label>
                  <div className="mt-3">
                    <textarea
                      rows="4"
                      name="biografia"
                      value={usuario.biografia}
                      onChange={handleChange}
                      placeholder="Cuéntanos un poco sobre ti..."
                      className="block w-full pl-6 pr-3 py-3 bg-[#161616] text-white rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    ></textarea>
                  </div>
                </div>

                {/* Botón Guardar */}
                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    className="text-lg w-full bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition duration-200 shadow-md cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* SECCIÓN PLANES */}
        {usuario.rol === "usuario" && (
          <div className="rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Conviértete en Vendedor
            </h2>
            <p className="text-lg mb-10">Elige un plan para empezar a vender tus productos.</p>

            {loadingPlanes ? (
              <p className="text-gray-500 text-lg">Cargando planes...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {planes.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative shadow-2xl p-10 flex flex-col items-center border-2 scale-[1.05] transition duration-300 transform hover:-translate-y-2`}
                  >
                    {plan.destacado && (
                      <span className="absolute top-0 right-0 -mt-4 mr-4 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">
                        Popular
                      </span>
                    )}

                    <h3 className={`font-bold mb-2 ${plan.destacado ? 'text-3xl text-indigo-200' : 'text-2xl text-white'}`}>
                      {plan.nombre}
                    </h3>

                    <p className={`font-extrabold text-white mb-4 ${plan.destacado ? 'text-7xl' : 'text-6xl'}`}>
                      S/{Number(plan.precio).toFixed(0)}
                      <span className="text-base font-normal text-gray-500">{plan.periodo}</span>
                    </p>

                    <ul className="space-y-3 text-indigo-200 mb-8 text-left w-full">
                      {plan.caracteristicas.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto w-full">
                      {plan.deshabilitado ? (
                        <button
                          disabled
                          className="w-full bg-indigo-100 text-indigo-700 py-4 rounded-xl font-bold cursor-not-allowed opacity-50 shadow-inner"
                        >
                          Elegir plan
                        </button>
                      ) : (
                        <Link
                          to={plan.url_contratacion}
                          className="block w-full bg-amber-500 hover:bg-amber-400 text-white py-4 rounded-xl font-bold transition duration-200 shadow-lg text-center"
                        >
                          Elegir plan
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}