import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCartIcon, ChatBubbleLeftRightIcon, StarIcon, BanknotesIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline'; // Importing some example icons
import { useState } from 'react';
export default function ProductIndi() {
  const mainProduct = {
    name: 'Cámara Web Logitech Mx Brio Pro 700 Ultra Hd 4K Black',
    sku: '25000000055',
    priceUSD: '176.00',
    pricePEN: '666.00',
    stock: 5,
    mainImage: 'https://via.placeholder.com/600x400',
    thumbnails: [
      'https://via.placeholder.com/150x150',
      'https://via.placeholder.com/150x150',
      'https://via.placeholder.com/150x150',
    ],
    relatedProducts: [
      {
        name: 'CÁMARA WEB TEROS TE-8072 2K FHD C/TRIPODE-OEITURA',
        image: 'https://via.placeholder.com/200x200',
        price: 'S/68.00',
        oldPrice: 'S/72.00',
      },
      {
        name: 'CÁMARA WEB LOGITECH MX BRIO PRO 700 ULTRA HD 4K BLACK',
        image: 'https://via.placeholder.com/200x200',
        price: 'S/666.00',
        oldPrice: 'S/666.00',
      },
      {
        name: 'CÁMARA WEB LOGITECH C920S HD PRO',
        image: 'https://via.placeholder.com/200x200',
        price: 'S/259.00',
        oldPrice: 'S/270.00',
      },
      {
        name: 'CÁMARA WEB RAZER KIYO PRO',
        image: 'https://via.placeholder.com/200x200',
        price: 'S/799.00',
        oldPrice: 'S/850.00',
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-8 lg:py-12 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8">
            {/* Main Product Image and Thumbnails */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="w-full max-w-lg mb-4 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={mainProduct.mainImage}
                  alt={mainProduct.name}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex gap-4 mt-4 justify-center flex-wrap">
                {mainProduct.thumbnails.map((thumb, index) => (
                  <div key={index} className={`w-24 h-24 p-1 rounded-md cursor-pointer ${index === 0 ? 'border-2 border-blue-500' : 'border border-gray-300 hover:border-blue-500'}`}>
                    <img
                      src={thumb}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Modalities Section */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg w-full max-w-lg shadow-inner">
                <h3 className="text-lg font-bold mb-4 text-center">Explora nuestras modalidades</h3>
                <div className="flex justify-around gap-4">
                  <button className="flex flex-col items-center justify-center p-4 w-full border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <img src="/path-to-pickup-icon.svg" alt="Métodos de Retiro" className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">Métodos de Retiro</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 w-full border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <img src="/path-to-shipping-icon.svg" alt="Métodos de Envío" className="w-8 h-8 mb-2" />
                    <span className="text-sm font-semibold">Métodos de Envío</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details and CTA */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full self-start">
                CÁMARA WEB
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{mainProduct.name}</h1>
              <div className="flex items-center text-yellow-500">
                {[...Array(4)].map((_, i) => <StarIcon key={`star-${i}`} className="w-5 h-5 fill-current" />)}
                <StarIcon className="w-5 h-5 text-gray-300" />
              </div>
              
              <button className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl text-lg hover:bg-yellow-500 transition-colors shadow-md">
                Ver detalles del producto
              </button>
              
              <div className="text-sm text-gray-500 mt-2">SKU {mainProduct.sku}</div>
              <div className="flex items-end gap-4 mt-2 flex-wrap">
                <span className="text-4xl font-bold text-red-600">${mainProduct.priceUSD}</span>
                <span className="text-4xl font-bold text-gray-900">ó {mainProduct.pricePEN}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{mainProduct.stock} unidades disponibles</div>

              {/* Key features/info */}
              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3">
                  <CreditCardIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-green-600">Pago seguro con tarjetas</span>
                    <p className="text-gray-500 text-sm">Paga con total confianza.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BanknotesIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-green-600">Precios con IGV incluido</span>
                    <p className="text-gray-500 text-sm">Es lo que ves es lo que pagas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-600 text-2xl font-bold flex-shrink-0 leading-none">!</span>
                  <div>
                    <span className="font-semibold text-yellow-600">Sujeto a variaciones</span>
                    <p className="text-gray-500 text-sm">¡Aprovecha el mejor precio hoy!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TruckIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-red-600">Envío no incluido</span>
                    <p className="text-gray-500 text-sm">Calcula el costo de envío según tu ubicación.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-2xl font-bold flex-shrink-0 leading-none">&#10003;</span>
                  <div>
                    <span className="font-semibold text-green-600">Precios válidos</span>
                    <p className="text-gray-500 text-sm">Ver en tienda y tienda online.</p>
                  </div>
                </div>
              </div>
              
              <button className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-green-600 transition-colors mt-6 shadow-md">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                <span>Consulta aquí</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-blue-700 transition-colors shadow-md">
                <ShoppingCartIcon className="w-6 h-6" />
                <span>Añadir al carrito</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mainProduct.relatedProducts.map((product, index) => (
              <div key={index} className="flex flex-col bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex-grow flex items-center justify-center mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-auto h-32 object-contain"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-700 flex-grow mb-2">
                  {product.name}
                </p>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-xl font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}