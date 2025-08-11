import { addToCart } from "../services/cartService";

export default function ProductCard({ product }) {
  const handleAdd = async () => {
    const res = await addToCart(product.id, 1);
    alert(res.msg || 'Producto agregado');
  };

  return (
    <div className="border rounded-xl shadow p-4 bg-white">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <button
        onClick={handleAdd}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Agregar al carrito
      </button>
    </div>
  );
}