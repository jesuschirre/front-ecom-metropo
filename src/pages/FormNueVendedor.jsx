import { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function FormNueVendedor() {
  const { usuario } = useAuth();
  console.log("Datos del usuario logueado:", usuario);

  const [form, setForm] = useState({
    metodo_pago: "yape",
    monto: "",
    referencia_pago: "",
    comprobante_pago: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "comprobante_pago") {
      setForm({ ...form, comprobante_pago: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !usuario.id) {
      alert("No hay usuario logueado");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("usuario_id", usuario.id);
    formData.append("metodo_pago", form.metodo_pago);
    formData.append("monto", form.monto);
    formData.append("referencia_pago", form.referencia_pago);
    formData.append("comprobante_pago", form.comprobante_pago);

    try {
      const res = await fetch(
        "http://localhost:3000/solicitudes/solicitar-vendedor",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      alert(data.message || "Solicitud enviada correctamente");

      setForm({
        metodo_pago: "yape",
        monto: "",
        referencia_pago: "",
        comprobante_pago: null,
      });

      e.target.reset();
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      alert("Hubo un error al enviar la solicitud");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-scree flex items-center justify-center py-8">
        <div className="max-w-lg w-full bg-white shadow-2xl rounded-xl p-8 transform transition-all hover:shadow-3xl">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Pago del Servicio
          </h2>

          {/* Instrucciones */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-6 rounded-lg">
            <p className="text-sm text-gray-700">
              📲 Paga con <strong>Yape</strong> o <strong>Plin</strong> al número:{" "}
              <span className="font-semibold text-blue-600">987 654 321</span> o escanea el QR y sube tu comprobante.
            </p>
            <img
              src="/qr-yape.png"
              alt="QR Code"
              className="w-48 mx-auto mt-4 border-2 border-gray-200 rounded-lg shadow-sm"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de pago
              </label>
              <select
                name="metodo_pago"
                value={form.metodo_pago}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
              </select>
            </div>

            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto
              </label>
              <select
                name="monto"
                value={form.monto}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              >
                <option value="">Selecciona un monto</option>
                <option value="9.00">Básico - S/ 9.00</option>
                <option value="19.00">Estándar - S/ 19.00</option>
                <option value="29.00">Avanzado - S/ 29.00</option>
              </select>
            </div>

            {/* Referencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia de pago
              </label>
              <input
                type="text"
                name="referencia_pago"
                value={form.referencia_pago}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>

            {/* Comprobante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subir comprobante
              </label>
              <input
                type="file"
                name="comprobante_pago"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                required
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
}