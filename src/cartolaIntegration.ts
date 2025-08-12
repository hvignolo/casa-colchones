import { calculateTwelveInstallmentsPrice } from './useFinancingCalculator';

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  medidas: string;
  tipo: string;
  subtipo: string;
  precioContado: number;
  precioTarjeta: number;
  detalles: string;
  image: string;
  marca: string;
}

interface CartolaData {
  titulo: string;
  oferta: string;
  producto: string;
  precioActual: string;
  precioAnterior: string;
  caracteristica1: string;
  caracteristica2: string;
  caracteristica3: string;
  mensajeFinal: string;
}

// Tipo para los estilos de cartola disponibles (agregado para compatibilidad)
export type EstiloCartola = 
  | 'modern' 
  | 'original' 
  | 'minimal' 
  | 'gradient' 
  | 'dark' 
  | 'geometric' 
  | 'wellness' 
  | 'sale' 
  | 'delicate';

/**
 * Convierte un producto en datos para cartola
 */
export const productToCartolaData = (product: Product): CartolaData => {
  // Calcular precio de 12 cuotas para mostrar como precio anterior
  const precio12Cuotas = calculateTwelveInstallmentsPrice(product.precioContado);
  
  // Formatear precios
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Extraer características del producto
  const extractCharacteristics = (product: Product) => {
    const characteristics = [];
    
    // Característica 1: Tipo y subtipo
    if (product.subtipo) {
      characteristics.push(product.subtipo);
    }
    
    // Característica 2: Medidas
    if (product.medidas) {
      characteristics.push(`Medidas: ${product.medidas}`);
    }
    
    // Característica 3: Marca
    if (product.marca) {
      characteristics.push(`Marca: ${product.marca}`);
    }
    
    // Si tenemos detalles, intentar extraer más características
    if (product.detalles && characteristics.length < 3) {
      const detallesParts = product.detalles.split('.').filter(part => part.trim().length > 0);
      detallesParts.forEach((part, index) => {
        if (characteristics.length < 3) {
          characteristics.push(part.trim());
        }
      });
    }
    
    return characteristics;
  };

  const characteristics = extractCharacteristics(product);

  // Determinar mensaje según el tipo de producto
  const getMessageByType = (tipo: string) => {
    switch (tipo.toUpperCase()) {
      case 'COLCHONES':
        return '¡Renová tu descanso!';
      case 'SOMMIERS':
        return '¡Completá tu dormitorio!';
      case 'ALMOHADAS':
        return '¡Para un sueño perfecto!';
      case 'ACOLCHADOS':
        return '¡Comodidad todo el año!';
      case 'RESPALDOS':
        return '¡Dale estilo a tu cama!';
      case 'OTROS':
        return '¡Aprovechá esta oferta!';
      default:
        return '¡Aprovechá esta oferta!';
    }
  };

  // Determinar oferta según la diferencia de precios
  const diferenciaPrecio = precio12Cuotas - product.precioContado;
  const porcentajeDescuento = ((diferenciaPrecio / precio12Cuotas) * 100);
  
  let ofertaTexto = 'OFERTA ESPECIAL';
  if (porcentajeDescuento > 15) {
    ofertaTexto = 'SÚPER OFERTA';
  } else if (porcentajeDescuento > 25) {
    ofertaTexto = 'OFERTA IMPERDIBLE';
  }

  return {
    titulo: product.nombre.toUpperCase(),
    oferta: ofertaTexto,
    producto: `${product.tipo}\n${product.nombre}`,
    precioActual: formatPrice(product.precioContado),
    precioAnterior: formatPrice(precio12Cuotas),
    caracteristica1: characteristics[0] || product.subtipo,
    caracteristica2: characteristics[1] || `Medidas: ${product.medidas}`,
    caracteristica3: characteristics[2] || `Marca: ${product.marca}`,
    mensajeFinal: getMessageByType(product.tipo)
  };
};

/**
 * Configura el estilo de cartola basado en el tipo de producto
 */
export const getCartolaStyleByProductType = (tipo: string): EstiloCartola => {
  switch (tipo.toUpperCase()) {
    case 'COLCHONES':
      return 'wellness'; // Verde para descanso/bienestar
    case 'SOMMIERS':
      return 'modern'; // Moderno para muebles
    case 'ALMOHADAS':
      return 'delicate'; // Suave para almohadas
    case 'ACOLCHADOS':
      return 'gradient'; // Colorido para textiles
    case 'RESPALDOS':
      return 'geometric'; // Geométrico para respaldos
    case 'OTROS':
      return 'original'; // Azul clásico por defecto
    default:
      return 'original'; // Azul clásico por defecto
  }
};

// FUNCIONES ADICIONALES PARA COMPATIBILIDAD CON EL SISTEMA OFFLINE

/**
 * Calcula el porcentaje de descuento para mostrar en la cartola
 */
export const calculateDiscountPercentage = (precioContado: number, precioTarjeta: number): number => {
  const descuento = precioTarjeta - precioContado;
  return Math.round((descuento / precioTarjeta) * 100);
};

/**
 * Genera una descripción de producto optimizada para cartola
 */
export const generateCartolaDescription = (product: Product): string => {
  const baseDescription = product.nombre;
  const features = [product.subtipo, `${product.medidas}`].filter(Boolean);
  
  return `${baseDescription} - ${features.slice(0, 2).join(' • ')}`;
};

/**
 * Genera datos de cartola optimizados para redes sociales
 */
export const generateSocialMediaCartola = (product: Product): CartolaData => {
  const baseData = productToCartolaData(product);
  
  return {
    ...baseData,
    titulo: baseData.titulo.toUpperCase(),
    mensajeFinal: '¡Compartí esta oferta! 📱 Consultá por WhatsApp',
    caracteristica1: `✅ ${baseData.caracteristica1}`,
    caracteristica2: `✅ ${baseData.caracteristica2}`, 
    caracteristica3: `✅ ${baseData.caracteristica3}`
  };
};

/**
 * Obtiene colores recomendados según el tipo de producto
 */
export const getRecommendedColors = (tipo: string) => {
  const colorMap = {
    'COLCHONES': {
      primary: '#3b82f6',   // Azul - tranquilidad
      secondary: '#e0f2fe', // Azul claro
      accent: '#0ea5e9'     // Azul medio
    },
    'SOMMIERS': {
      primary: '#6366f1',   // Índigo - elegancia
      secondary: '#f0f9ff',
      accent: '#4f46e5'
    },
    'RESPALDOS': {
      primary: '#8b5cf6',   // Púrpura - sofisticación
      secondary: '#faf5ff',
      accent: '#7c3aed'
    },
    'ALMOHADAS': {
      primary: '#ec4899',   // Rosa - suavidad
      secondary: '#fef7ff',
      accent: '#d946ef'
    },
    'ACOLCHADOS': {
      primary: '#f59e0b',   // Amarillo - calidez
      secondary: '#fffbeb',
      accent: '#d97706'
    },
    'OTROS': {
      primary: '#10b981',   // Verde - versatilidad
      secondary: '#f0fdf4',
      accent: '#059669'
    }
  };

  return colorMap[tipo as keyof typeof colorMap] || colorMap.OTROS;
};

/**
 * Genera múltiples variaciones de cartola para A/B testing
 */
export const generateCartolaVariations = (product: Product): CartolaData[] => {
  const base = productToCartolaData(product);
  
  const variations: CartolaData[] = [
    base,
    {
      ...base,
      titulo: '🔥 OFERTA CALIENTE 🔥',
      mensajeFinal: '¡Solo por HOY! ⏰'
    },
    {
      ...base,
      titulo: '💥 PRECIO REBAJADO 💥',
      mensajeFinal: '¡Último stock disponible!'
    },
    {
      ...base,
      titulo: '⭐ SÚPER PROMOCIÓN ⭐',
      mensajeFinal: '¡No dejes pasar esta oportunidad!'
    }
  ];
  
  return variations;
};