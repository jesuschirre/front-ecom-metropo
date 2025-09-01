// App.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Tienda() { 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, nombre: "Todo" }]);
  const [selectedCategory, setSelectedCategory] = useState(0); // 0 = Todo
  const [priceRange, setPriceRange] = useState({ min:1, max: 2000000 });
  const [selectedBrand, setSelectedBrand] = useState('Todo');
  const [sortBy, setSortBy] = useState('price-asc');
  const [productsPerPage, setProductsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // Cargar productos y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await fetch("http://localhost:3000/productos");
        const dataProd = await resProd.json();
        setProducts(dataProd);

        const resCat = await fetch("http://localhost:3000/categorias");
        const dataCat = await resCat.json();

        // Guardamos categorías como objetos con id y nombre
        setCategories([{ id: 0, nombre: "Todo" }, ...dataCat]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    fetchData();
  }, []);

  // Filtrado
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 0 || product.categoria_id === selectedCategory;
      const matchesPrice = product.precio >= priceRange.min && product.precio <= priceRange.max;
      const matchesBrand = selectedBrand === "Todo" || product.marca === selectedBrand;
      return matchesCategory  && matchesPrice && matchesBrand;
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
      <div className="min-h-screen font-sans text-white bg-gray-950 pt-20">
        <main className="container mx-auto p-4 md:p-8 flex flex-col gap-6">

          {/* Ordenar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center w-full">
              <label htmlFor="sort" className="text-lg">Ordenar</label>
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

          {/* Contenedor principal */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar filtros */}
            <aside className="w-full md:w-1/4 bg-black rounded-lg shadow-lg mb-6 md:mb-0 p-3 mx-1">
              
              {/* Categorías */}
              <div className="border-gray-700">
                <div
                  className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span className="text-lg">Categorías</span>
                  {isCategoriesOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                <div className={`${isCategoriesOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all duration-500`}>
                  <div className="p-4 pt-0">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full p-2 rounded-xs text-left cursor-pointer ${
                          selectedCategory === cat.id ? "bg-gray-700 font-bold" : "hover:bg-gray-800"
                        }`}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rango de precio */}
              <div className="border-gray-700 mt-4">
                <div
                  className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                >
                  <span className="text-lg">Precio</span>
                  {isPriceOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                <div className={`${isPriceOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all duration-500`}>
                  <div className="p-4 pt-2 flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Lista de productos */}
            <section className="w-full md:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
                        onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image"; }}
                      />
                      <div className="p-4 grid grid-cols-2 items-center gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-white truncate">{product.nombre}</h3>
                          <p className="text-sm text-gray-400 truncate">{product.descripcion}</p>
                        </div>
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