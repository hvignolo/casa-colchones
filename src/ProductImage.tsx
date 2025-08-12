import React from 'react';
import { Bed, Package } from 'lucide-react';

interface ImagePlaceholderProps {
  tipo: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Componente de placeholder para imágenes cuando no cargan (modo offline)
 */
export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  tipo, 
  className = "w-full h-full", 
  size = 'medium' 
}) => {
  // Función para obtener el icono según el tipo de producto
  const getIconByType = (tipo: string) => {
    switch (tipo.toUpperCase()) {
      case 'COLCHONES':
      case 'SOMMIERS':
        return Bed;
      case 'RESPALDOS':
        return Package;
      case 'ALMOHADAS':
        return Package;
      case 'OTROS':
      default:
        return Package;
    }
  };

  // Función para obtener colores según el tipo
  const getColorsByType = (tipo: string) => {
    switch (tipo.toUpperCase()) {
      case 'COLCHONES':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-400',
          border: 'border-blue-100'
        };
      case 'SOMMIERS':
        return {
          bg: 'bg-indigo-50',
          icon: 'text-indigo-400',
          border: 'border-indigo-100'
        };
      case 'RESPALDOS':
        return {
          bg: 'bg-purple-50',
          icon: 'text-purple-400',
          border: 'border-purple-100'
        };
      case 'ALMOHADAS':
        return {
          bg: 'bg-pink-50',
          icon: 'text-pink-400',
          border: 'border-pink-100'
        };
      case 'OTROS':
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-400',
          border: 'border-gray-100'
        };
    }
  };

  // Función para obtener tamaño del icono
  const getIconSize = (size: string) => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-6 h-6';
      case 'large':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const IconComponent = getIconByType(tipo);
  const colors = getColorsByType(tipo);
  const iconSize = getIconSize(size);

  return (
    <div 
      className={`${className} ${colors.bg} ${colors.border} border-2 border-dashed flex items-center justify-center rounded-lg relative overflow-hidden`}
    >
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.1) 10px,
            rgba(0,0,0,0.1) 11px
          )`
        }} />
      </div>
      
      {/* Contenido del placeholder */}
      <div className="flex flex-col items-center justify-center p-2 z-10">
        <IconComponent className={`${iconSize} ${colors.icon} mb-1`} />
        <span className={`text-xs ${colors.icon} font-medium opacity-60 text-center`}>
          {tipo}
        </span>
      </div>

      {/* Indicador de offline */}
      <div className="absolute top-1 right-1">
        <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60" />
      </div>
    </div>
  );
};

/**
 * Hook personalizado para manejar imágenes con fallback offline
 */
export const useImageWithFallback = (src: string, tipo: string) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = React.useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = React.useCallback(() => {
    setImageLoaded(false);
    setImageError(true);
  }, []);

  return {
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError
  };
};

/**
 * Componente de imagen con placeholder automático
 */
export const ProductImage: React.FC<{
  src: string;
  alt: string;
  tipo: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ src, alt, tipo, className = "w-full h-full", size = 'medium' }) => {
  const { imageLoaded, imageError, handleImageLoad, handleImageError } = useImageWithFallback(src, tipo);

  if (imageError) {
    return (
      <ImagePlaceholder 
        tipo={tipo} 
        className={className} 
        size={size}
      />
    );
  }

  return (
    <div className={`${className} relative`}>
      {!imageLoaded && (
        <div className="absolute inset-0 z-10">
          <ImagePlaceholder 
            tipo={tipo} 
            className="w-full h-full" 
            size={size}
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;