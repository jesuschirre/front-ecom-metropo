import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Productos = () => {
  const [vendedorProd, setVendedorProd] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagen: "",
    categoria_id: "" // NUEVO: categoría
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Traer productos del vendedor
    fetch("http://localhost:3000/productos/mis-productos", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVendedorProd(data))
      .catch((err) => console.error(err));

    // Traer categorías
    fetch("http://localhost:3000/categorias", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err));
  }, []);

  // Editar producto
  const handleChange = (id, field, value) => {
    setVendedorProd((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, [field]: value } : prod
      )
    );
  };

  const handleGuardar = async (prod) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/productos/${prod.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prod),
      });

      const data = await res.json();
      if (res.ok) {
         Swal.fire({ title: "¡Producto actualizado!", text: data.message, icon: "success", timer: 2000, showConfirmButton: true });
      } else {
        alert(data.error || "Error al actualizar producto");
      }
    } catch (err) {
      console.error(err);
    }
  };
 
  // manejo de inputs de creacion de un producto
  const handleChangeProduct = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // creacion de un nuevo producto 
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🚫 evita la recarga automática
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          title: "¡Producto creado!",
          text: data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: true,
          willClose: () => {
            // Acción por defecto: recargar página
            location.reload();
          }
        });
        setProducto({
          nombre: "",
          descripcion: "",
          precio: 0,
          stock: 0,
          imagen: "",
          categoria_id: ""
        });
      } else {
        alert(data.error || "Error al crear producto");
      }
    } catch (err) {
      console.error("Error al crear producto:", err);
      alert("Error de conexión");
    }
  };

  // --- ELIMINAR PRODUCTO ---
  const handleEliminar = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setVendedorProd(vendedorProd.filter((p) => p.id !== id));
        Swal.fire({
          title: "Eliminar",
          text: "Se elimino satisfactoriamente",
          icon: "success",
          confirmButtonText: "Ok"
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.error || "Error al eliminar producto",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-white">
      
      <div className="space-y-4 bg-[#232323] rounded-lg p-8 lg:p-10 font-[Sora]">
        <h2 className="text-2xl font-bold mb-6">Mis Productos</h2>
        
        {vendedorProd && vendedorProd.length > 0 ? (
          vendedorProd.map((prod) => (
            <div
              key={prod.id}
              className="flex gap-4 items-center mb-10"
            >
              <div className="grid grid-cols-4 gap-2 flex-grow">

                <div>
                  <label className="block text-sm font-semibold mb-3">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={prod.nombre || ""}
                    onChange={(e) =>
                      handleChange(prod.id, "nombre", e.target.value)
                    }
                    className= "bg-[#161616] text-[#8A8AA0] p-2 rounded w-full"
                  />
                </div>
                

                <div>
                  <label className="block text-sm font-semibold mb-3">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={prod.precio || 0}
                    onChange={(e) =>
                      handleChange(prod.id, "precio", e.target.value)
                    }
                    className="bg-[#161616] text-[#8A8AA0] p-2 rounded w-full "
                  />
                </div>
                

                <div>
                   <label className="block text-sm font-semibold mb-3">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={prod.stock || 0}
                    onChange={(e) =>
                      handleChange(prod.id, "stock", e.target.value)
                    }
                    className="bg-[#161616] text-[#8A8AA0] p-2 rounded w-full"
                  />
                </div>
                

                <div>
                  <label className="block text-sm font-semibold mb-3">Categoría</label>
                  <select
                    name="categoria_id"
                    value={prod.categoria_id || ""}
                    onChange={(e) =>
                      handleChange(prod.id, "categoria_id", e.target.value)
                    }
                    className= "bg-[#161616] text-[#8A8AA0] p-2 rounded w-full"
                  >
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                

                <div className="col-span-4">
                  <label className="block text-sm font-semibold mb-3">Descripción</label>
                  <textarea 
                    type="text"
                    name="descripcion"
                    value={prod.descripcion || ""}
                    onChange={(e) =>
                      handleChange(prod.id, "descripcion", e.target.value)
                    }
                    className="bg-[#161616] text-[#8A8AA0]  p-1 rounded w-full "
                  />
                </div>
                

                <div className="col-span-4 ">
                  <label className="block text-sm font-semibold mb-3">Imagen</label>
                  <input
                    type="text"
                    name="imagen"
                    value={prod.imagen || ""}
                    onChange={(e) =>
                      handleChange(prod.id, "imagen", e.target.value)
                    }
                    className="pl-3 pr-3 py-2 bg-[#161616] text-[#8A8AA0] p-1 rounded w-full "
                  />
                </div>
                <hr className="my-4 border-t border-gray-700 col-span-4"/>

              </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleGuardar(prod)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => handleEliminar(prod.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                  >
                    Eliminar
                  </button>
                </div>
            </div>
            
          ))
        ) : (
          <p className="text-gray-400">No hay productos disponibles.</p>
        )}
      </div>

      <div className="bg-[#232323] text-white rounded-3xl shadow-2xl p-8 lg:p-10 mt-9 font-[Sora]">
        <h1 className="text-2xl font-bold mb-6">Crear un nuevo producto</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <div className="mt-3 relative rounded-md shadow-sm">
              <input
                type="text"
                name="nombre"
                placeholder="nombre del producto"
                value={producto.nombre}
                onChange={handleChangeProduct}
                className="block w-full pl-3 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 
                          focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold mb-1">Categoría</label>
            <div className="mt-3 relative rounded-md shadow-sm">
              <select
                name="categoria_id"
                value={producto.categoria_id}
                onChange={handleChangeProduct}
                required
                className="block w-full pl-3 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl 
                          border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold mb-1">Precio</label>
            <div className="mt-3 relative rounded-md shadow-sm">
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={producto.precio}
                onChange={handleChangeProduct}
                className="block w-full pl-3 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 
                          focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold mb-1">Stock</label>
            <div className="mt-3 relative rounded-md shadow-sm">
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={producto.stock}
                onChange={handleChangeProduct}
                className="block w-full pl-3 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 
                          focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Imagen</label>
            <div className="mt-3 relative rounded-md shadow-sm">
              <input
                type="text"
                name="imagen"
                placeholder="Url imagen"
                value={producto.imagen}
                onChange={handleChangeProduct}
                className="block w-full pl-3 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 
                          focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Descripción</label>
            <div className="mt-3">
              <textarea
                name="descripcion"
                rows="4"
                placeholder="Describenos el producto..."
                value={producto.descripcion}
                onChange={handleChangeProduct}
                className="block w-full pl-3 pr-3 py-3 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 
                          focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              ></textarea>
            </div>
          </div>

          {/* Botón */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-amber-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 
                        transition duration-200 shadow-md cursor-pointer"
            >
              Crear producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Productos;