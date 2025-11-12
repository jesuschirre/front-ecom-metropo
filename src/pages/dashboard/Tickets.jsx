import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function Tickets() {
  const { usuario } = useAuth();

  const [formData, setFormData] = useState({
    cliente_id: null,
    asunto: "",
    categoria: "",
  });

  // Esperar a que usuario esté disponible
  useEffect(() => {
    if (usuario && usuario.id) {
      setFormData((prev) => ({
        ...prev,
        cliente_id: usuario.id,
      }));
    }
  }, [usuario]); 


  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "¡Ticket creado exitosamente!",
          text: data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reiniciar formulario y cerrar modal
        setFormData({
          cliente_id: usuario.id,
          asunto: "",
          categoria: "",
        });
        setShowModal(false);
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "No se pudo crear su ticket",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      Swal.fire({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

return (
  <div className="relative flex flex-col items-end w-full  bg-black h-screen">
    {/* Botón para abrir el modal */}
    <button
      onClick={() => setShowModal(true)}
      className="text-lg bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition duration-200 shadow-md cursor-pointer"
    >
      Crear un nuevo ticket
    </button>

    {/* Modal dentro del contenido (no cubre sidebar) */}
    {showModal && (
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-[#232323] text-white rounded-3xl shadow-2xl p-8 lg:p-10 font-sans w-full max-w-2xl relative transform transition-all duration-300 scale-100">
          {/* Botón de cierre */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">
            Crear Ticket de Soporte
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Asunto */}
            <div>
              <label className="block text-lg font-semibold mb-1">Asunto</label>
              <input
                type="text"
                name="asunto"
                placeholder="Describe brevemente tu problema"
                value={formData.asunto}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-[#161616] text-white rounded-xl border border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-lg font-semibold mb-1">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-[#161616] text-white rounded-xl border border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="Consulta_General">General</option>
                <option value="Soporte_Tecnico">Soporte técnico</option>
                <option value="Mejora_Campana">Mejora de campaña</option>
                <option value="Facturacion">Facturación</option>
              </select>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-200"
            >
              Enviar Ticket
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
);
}