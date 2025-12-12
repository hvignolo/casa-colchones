import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { FILTER_CHIPS } from '../components/IconComponents';
import ProductCard from '../components/public/ProductCard';

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply category filter
    if (activeFilter !== "TODOS") {
      if (activeFilter === "RESORTES") {
        filtered = filtered.filter(p =>
          (p.tipo === 'COLCHONES' || p.tipo === 'SOMMIERS') &&
          p.subtipo.toLowerCase().includes("resortes")
        );
      } else if (activeFilter === "ESPUMA") {
        filtered = filtered.filter(p =>
          (p.tipo === 'COLCHONES' || p.tipo === 'SOMMIERS') &&
          p.subtipo.toLowerCase().includes("espuma")
        );
      } else {
        filtered = filtered.filter((product) => product.tipo === activeFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.subtipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.detalles.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.precioContado >= priceRange[0] &&
        product.precioContado <= priceRange[1]
    );

    // Apply sorting
    // Create a copy to avoid mutating the original products array from context
    // if no filters were applied (which would have already created a new array)
    if (filtered === products) {
      filtered = [...filtered];
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.precioContado - b.precioContado;
        case 'price-high':
          return b.precioContado - a.precioContado;
        case 'newest':
          return b.id - a.id;
        case 'name':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

    return filtered;
  }, [activeFilter, searchQuery, priceRange, sortBy, products]);

  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.precioContado)) : 2000000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Catálogo de Productos
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Descubrí nuestra amplia selección de colchones, sommiers y accesorios para el mejor descanso
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, código, marca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
                <SlidersHorizontal className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Filter Panel */}
            <div className={`bg-white rounded-2xl shadow-card p-6 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Category Filters */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h3>
                <div className="space-y-2">
                  {FILTER_CHIPS.map((chip) => {
                    const IconComponent = chip.icon;
                    const isActive = activeFilter === chip.id;

                    return (
                      <button
                        key={chip.id}
                        onClick={() => setActiveFilter(chip.id)}
                        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${isActive
                          ? "bg-gradient-primary text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        <span className="font-medium">{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rango de Precio</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio mínimo: ${priceRange[0].toLocaleString('es-AR')}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="10000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio máximo: ${priceRange[1].toLocaleString('es-AR')}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setActiveFilter('TODOS');
                  setSearchQuery('');
                  setPriceRange([0, maxPrice]);
                  setSortBy('newest');
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  Mostrando {filteredProducts.length} de {products.length} productos
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Más recientes</option>
                  <option value="name">Ordenar por nombre</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros o términos de búsqueda
                </p>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                : 'grid-cols-1'
                }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="catalog"
                    className={viewMode === 'list' ? 'max-w-none' : ''}
                  />
                ))}
              </div>
            )}

            {/* Load More Button (for future pagination) */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-gradient-primary text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transition-all duration-300">
                  Cargar Más Productos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;