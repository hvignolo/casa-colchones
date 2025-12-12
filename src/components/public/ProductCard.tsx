import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  variant?: 'featured' | 'catalog';
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  variant = 'catalog',
  className = ''
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const cardSizeClasses = variant === 'featured'
    ? 'h-auto'
    : 'h-full';

  return (
    <div className={`group ${className}`}>
      <div className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden transform group-hover:-translate-y-1 sm:group-hover:-translate-y-2 ${cardSizeClasses}`}>
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.nombre}
            className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors transform hover:scale-110">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>
              <Link
                to={`/product/${product.id}`}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors transform hover:scale-110"
              >
                <Eye className="w-4 h-4 text-gray-600 hover:text-primary" />
              </Link>
            </div>
          </div>

          {/* Product Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium">
              {product.tipo}
            </span>
          </div>

          {/* Discount Badge (if applicable) */}
          {product.precioTarjeta > product.precioContado && (
            <div className="absolute top-4 left-4 mt-8">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Descuento Contado
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-6">
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-500 ml-2">(4.8)</span>
          </div>

          {/* Product Name */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.nombre}
          </h3>

          {/* Product Details */}
          <div className="space-y-1 mb-3">
            <p className="text-gray-600 text-xs sm:text-sm">
              <span className="font-medium">Medidas:</span> {product.medidas}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              <span className="font-medium">Tipo:</span> {product.subtipo}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              <span className="font-medium">Marca:</span> {product.marca}
            </p>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <div className="flex flex-col gap-1 mb-2 items-start">
              <div>
                <span className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${formatPrice(product.precioContado)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1">contado</span>
              </div>
              {product.precioTarjeta !== product.precioContado && (
                <div className="text-left">
                  <div className="text-xs text-gray-500">o en cuotas</div>
                  <div className="text-sm sm:text-lg font-semibold text-primary">
                    ${formatPrice(product.precioTarjeta)}
                  </div>
                </div>
              )}
            </div>

            {/* Installment info */}
            <div className="text-xs text-gray-500">
              12 cuotas de ${formatPrice(product.precioTarjeta / 12)} sin interés
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 bg-gradient-primary text-white text-center py-2 sm:py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            >
              Ver Detalles
            </Link>
            <button
              onClick={handleCardClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 sm:p-3 rounded-full transition-colors"
              title="Agregar a favoritos"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;