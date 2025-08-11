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
export const getCartolaStyleByProductType = (tipo: string) => {
  switch (tipo.toUpperCase()) {
    case 'COLCHONES':
      return 'wellness'; // Verde para descanso/bienestar
    case 'SOMMIERS':
      return 'modern'; // Moderno para muebles
    case 'ALMOHADAS':
      return 'delicate'; // Suave para almohadas
    case 'ACOLCHADOS':
      return 'gradient'; // Colorido para textiles
    default:
      return 'original'; // Azul clásico por defecto
  }
};