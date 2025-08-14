import { useState, useEffect } from "react";

export default function FormNuevoPr() {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categoria_id: "" // NUEVO: categoría
  });

  const [categorias, setCategorias] = useState([]); // Para guardar categorías

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:3000/categorias");
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(producto)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Producto creado correctamente");
        setProducto({
          nombre: "",
          descripcion: "",
          precio: "",
          stock: "",
          imagen: "",
          categoria_id: ""
        }); // Limpiar form
      } else {
        alert(data.error || "Error al crear producto");
      }
    } catch (err) {
      console.error("Error al crear producto:", err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Agregar nuevo producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="descripcion"
          value={producto.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="precio"
          value={producto.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="stock"
          value={producto.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="imagen"
          value={producto.imagen}
          onChange={handleChange}
          placeholder="URL de la imagen"
          className="w-full p-2 border rounded"
        />

        {/* Select para categoría */}
        <select
          name="categoria_id"
          value={producto.categoria_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Crear producto
        </button>
      </form>
    </div>  
  );
}