// App.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Tienda() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todo']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 });
  const [selectedBrand, setSelectedBrand] = useState('Todo');
  const [sortBy, setSortBy] = useState('price-asc');
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para controlar la apertura de los filtros
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

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
     <Header />
      <div className="min-h-screen font-sans text-white bg-black pt-8">
        <main className="container mx-auto p-4 md:p-8 flex flex-col gap-6">
          
         {/* Ordenar por (Barra arriba) */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center w-full">
              <label htmlFor="sort" className="text-lg">Categorias</label>
              <select
                id="sort"
                className="p-2 rounded bg-gray-800 text-white"
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

          {/* Contenedor principal: filtros + productos */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar filtros */}
            <aside className="w-full md:w-1/4 bg-black rounded-lg shadow-lg mb-6 md:mb-0 p-3 mx-1">
              {/* Categorías */}
              <div className=" border-gray-700">
                <div
                  className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-gray-800 transition-colors duration-50"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span className="text-lg">Categorías</span>
                  <div className="text-gray-400 transition-transform duration-300 transform">
                    {isCategoriesOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                
                <div
                  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isCategoriesOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 pt-0">
                    {categories.map(cat => (
                      <button
                        className="w-full p-2 rounded-xs hover:bg-gray-800 cursor-pointer text-left"
                        key={cat}
                        value={cat}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rango de Precio */}
              <div className="border-gray-700">
                <div
                  className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                  <span className="text-lg text-white">Precio</span>
                  <div className="text-gray-400 transition-transform duration-300 transform">
                    {isPriceOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isPriceOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 pt-0">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-1/2 p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-1/2 p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Lista de productos */}
            <section className="w-full md:w-3/4">
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-10">
                {currentProducts.length > 0 ? (
                  currentProducts.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl block"
                    >
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-78 object-cover"
                        onError={(e) => { e.target.src = "https://placehold.co/300x300/CCCCCC/FFFFFF?text=Imagen+no+disponible"; }}
                      />
                      <div className="p-4 grid grid-cols-2 items-center gap-2">
                        {/* Nombre y descripción (columna izquierda) */}
                        <div>
                          <h3 className="text-lg font-bold text-white truncate">{product.nombre}</h3>
                          <h3 className="text-lg text-white truncate">{product.descripcion}</h3>
                        </div>

                        {/* Precio (columna derecha) */}
                        <p className="text-2xl font-bold text-white text-right">
                          S/ {Number(product.precio).toFixed(2)}
                        </p>
                      </div>

                    </Link>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-xl py-10 col-span-full">
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
                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
