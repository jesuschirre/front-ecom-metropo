import { useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

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

      // Opcional: limpiar input file manualmente si no se resetea
      e.target.reset();
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      alert("Hubo un error al enviar la solicitud");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Pago del Servicio</h2>

        {/* Instrucciones */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-sm">
            📲 Paga con <strong>Yape o Plin</strong> al número:{" "}
            <span className="font-bold">987 654 321</span> o escanea el QR y sube
            tu comprobante.
          </p>
          <img
            src="/qr-yape.png"
            alt="QR"
            className="w-40 mx-auto mt-2 border rounded"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium mb-1">Método de pago</label>
            <select
              name="metodo_pago"
              value={form.metodo_pago}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none"
            >
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium mb-1">Monto</label>
            <select
              name="monto"
              value={form.monto}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
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
            <label className="block text-sm font-medium mb-1">
              Referencia de pago
            </label>
            <input
              type="text"
              name="referencia_pago"
              value={form.referencia_pago}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Comprobante */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Subir comprobante
            </label>
            <input
              type="file"
              name="comprobante_pago"
              accept="image/*"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </>
  );
}