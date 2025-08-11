import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todo']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [selectedBrand, setSelectedBrand] = useState('Todo');
  const [sortBy, setSortBy] = useState('price-asc'); 
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar productos y categorías desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await fetch("http://localhost:3000/productos");
        const dataProd = await resProd.json();
        setProducts(dataProd);

        const resCat = await fetch("http://localhost:3000/categorias");
        const dataCat = await resCat.json();
        setCategories(['Todo', ...dataCat.map(cat => cat.nombre)]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todo' || product.categoria === selectedCategory;
      const matchesPrice = product.precio >= priceRange.min && product.precio <= priceRange.max;
      const matchesBrand = selectedBrand === 'Todo' || product.marca === selectedBrand;
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.precio - b.precio;
      if (sortBy === 'price-desc') return b.precio - a.precio;
      if (sortBy === 'name-asc') return a.nombre.localeCompare(b.nombre);
      if (sortBy === 'name-desc') return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
        <main className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
          {/* Sidebar filtros */}
          <aside className="w-full md:w-1/4 bg-white rounded-lg shadow-lg p-6 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Filtros</h2>

            {/* Categorías */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-lg font-semibold mb-2">Categorías</label>
              <select
                id="category"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Rango de Precio */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2">Precio</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 p-2 border rounded"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 p-2 border rounded"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                />
              </div>
            </div>
          </aside>

          {/* Lista de productos */}
          <section className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">PRODUCTOS</h1>

            {/* Ordenar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="sort" className="font-semibold">Ordenar por:</label>
                <select
                  id="sort"
                  className="p-2 border rounded"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`} 
                    className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl block"
                  >
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.src = "https://placehold.co/300x300/CCCCCC/FFFFFF?text=Imagen+no+disponible"; }}
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{product.nombre}</h3>
                      <p className="mt-2 text-2xl font-extrabold text-blue-600">
                        ${Number(product.precio).toFixed(2)}
                      </p>

                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-gray-600 text-xl py-10">
                  No se encontraron productos.
                </div>
              )}
            </div>

            {/* Paginación */}
            {filteredProducts.length > productsPerPage && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        </main>
        <Footer/>
      </div>
    </> 
  );
}