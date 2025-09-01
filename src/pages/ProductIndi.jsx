import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCartIcon, ChatBubbleLeftRightIcon, StarIcon, BanknotesIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline'; 
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

export default function ProductIndi() {
  const [product, setProduct] = useState(null); // null en vez de []
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await fetch(`http://localhost:3000/productos/producto/${id}`);
        const dataProd = await resProd.json();
        setProduct(dataProd);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, [id]);

  console.log(product)
  if (!product) {
    return <div className="text-center py-10">Cargando producto...</div>;
  }

  return (
    <>
      <Header />
      <main className="bg-black py-8 lg:py-12 font-sans text-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" shadow-lg p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-20">
            
            {/* Imagen principal y miniaturas */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="w-full mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.imagen || "https://via.placeholder.com/600x400"}
                  alt={product.nombre}
                  className="w-full h-auto"
                />
              </div>
              
              {/* Si el backend devuelve un array de imágenes relacionadas */}
              {product.thumbnails && (
                <div className="flex gap-4 mt-4 justify-center flex-wrap">
                  {product.thumbnails.map((thumb, index) => (
                    <div key={index} className={`w-24 h-24 p-1 rounded-md cursor-pointer ${index === 0 ? 'border-2 border-blue-500' : 'border border-gray-300 hover:border-blue-500'}`}>
                      <img
                        src={thumb}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detalles del producto */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full self-start">
                {product.categoria_nombre || "Sin categoría"}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-white">{product.nombre}</h1>
              <div className="flex items-end gap-4 mt-2 flex-wrap">
                <span className="text-2xl font-medium text-white">S/ {product.precio}</span>
              </div>

              <div className="text-lg text-white mt-2">SKU {product.sku || "N/A"}</div>
              <div className="text-lg text-white mt-1">{product.stock || 0} unidades disponibles</div>

              <div className="flex items-end gap-4 mt-2 flex-wrap">
                <span className="text-sm  text-white">{product.descripcion}</span>
              </div>

              {/* Botones CTA */}
              <button className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-green-600 transition-colors mt-6 shadow-md">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                <span>Consulta aquí</span>
              </button>

            
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
