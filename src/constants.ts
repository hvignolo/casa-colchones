import { StoreData } from './types';

// ==========================================
// CONSTANTES DE CONFIGURACIÓN DE NEGOCIO
// ==========================================

/**
 * Factor para convertir precio de contado en precio con tarjeta
 */
export const TARJETA_FACTOR = 1.4;

/**
 * Configuración de IVA
 */
export const VAT = 21.0;

/**
 * Duración por defecto de los toast en milisegundos
 */
export const TOAST_DURATION = 3000;

/**
 * Delay para simular operaciones de autenticación en milisegundos
 */
export const AUTH_DELAY = 800;

/**
 * Tiempo de debounce para búsquedas en milisegundos
 */
export const SEARCH_DEBOUNCE_TIME = 300;

// ==========================================
// CONSTANTES DE TIPOS DE PRODUCTOS
// ==========================================

/**
 * Tipos de productos disponibles
 */
export const PRODUCT_TYPES = {
  COLCHONES: 'COLCHONES',
  SOMMIERS: 'SOMMIERS',
  RESPALDOS: 'RESPALDOS',
  ALMOHADAS: 'ALMOHADAS',
  OTROS: 'OTROS'
} as const;

/**
 * Filtros disponibles para productos
 */
export const FILTER_IDS = {
  TODOS: 'TODOS',
  COLCHONES: 'COLCHONES', 
  SOMMIERS: 'SOMMIERS',
  RESORTES: 'RESORTES',
  ESPUMA: 'ESPUMA',
  RESPALDOS: 'RESPALDOS',
  ALMOHADAS: 'ALMOHADAS',
  OTROS: 'OTROS'
} as const;

/**
 * Configuración básica de los chips de filtros (sin iconos)
 * Los iconos se asignarán en el componente que los use
 */
export const FILTER_CHIPS_CONFIG = [
  { id: "TODOS", label: "Todos", iconType: "ShoppingBag" },
  { id: "COLCHONES", label: "Colchones", iconType: "Bed" },
  { id: "SOMMIERS", label: "Sommiers", iconType: "Bed" },
  { id: "RESORTES", label: "Resortes", iconType: "Bed" },
  { id: "ESPUMA", label: "Espuma", iconType: "Bed" },
  { id: "RESPALDOS", label: "Respaldos", iconType: "Armchair" },
  { id: "ALMOHADAS", label: "Almohadas", iconType: "Package" },
  { id: "OTROS", label: "Otros", iconType: "ShoppingBag" },
] as const;

// ==========================================
// CONSTANTES DE MAPEO DE PRODUCTOS
// ==========================================

/**
 * Mapeo entre códigos de sommiers y los códigos de los productos que lo componen.
 * Cada entrada define qué colchón y qué box(es) utiliza el sommier.
 */
export const SOMMIER_MAPPING: Record<string, string[]> = {
  // Sommiers TM Noche
  "SOM762": ["500108", "500085"], // Sommier TM Noche 080 = colchón 500108 + box extra 80 (500085)
  "SOM295": ["500105", "500092"], // Sommier TM Noche 100 = colchón 500105 + box extra 100 (500092)
  "SOM841": ["500107", "500095"], // Sommier TM Noche 140 = colchón 500107 + box extra 140 (500095)
  // Sommiers Arezzo
  "SOM624": ["500058", "500085"], // Sommier Arezzo 080 = colchón 500058 + box extra 80 (500085)
  "SOM189": ["500059", "500092"], // Sommier Arezzo 100 = colchón 500059 + box extra 100 (500092)
  "SOM456": ["500060", "500095"], // Sommier Arezzo 140 = colchón 500060 + box extra 140 (500095)
  // Sommiers Mikonos
  "SOM732": ["500077", "500079"], // Sommier Mikonos 140 = colchón 500077 + box T Clas 140 (500079)
  "SOM918": ["500083", "500096"], // Sommier Mikonos 080 = colchón 500083 + box T Clas 80 (500096)
};

// ==========================================
// CONSTANTES DE CALCULADORA DE PAGOS
// ==========================================

/**
 * Comisiones de viüMi por plazo de acreditación
 */
export const VIUMI_COMMISSIONS: Record<number, number> = { 
  2: 5.19, 
  5: 4.59, 
  10: 3.49, 
  20: 2.05, 
  40: 0.0 
};

/**
 * Tasas de financiación de viüMi por cuotas
 */
export const VIUMI_FINANCE: Record<number, number> = { 
  1: 0.0, 
  2: 0.0, 
  3: 12.66, 
  4: 0.0, 
  5: 0.0, 
  6: 21.01, 
  7: 0.0, 
  8: 0.0, 
  9: 29.28, 
  10: 0.0, 
  11: 0.0, 
  12: 35.79 
};

/**
 * Tasas de financiación MiPyME
 */
export const MIPYME_FINANCE: Record<number, number> = { 
  3: 5.93, 
  6: 11.24 
};

/**
 * Promoción Macro de viüMi por cuotas y plazo de acreditación
 */
export const VIUMI_MACRO_PROMO: Record<number, Record<number, number>> = {
  3: { 2: 9.50, 5: 9.03, 10: 8.17, 20: 7.05, 40: 5.45 },
  6: { 2: 12.50, 5: 12.18, 10: 11.66, 20: 10.60, 40: 8.48 },
  9: { 2: 15.60, 5: 15.32, 10: 14.79, 20: 13.73, 40: 11.62 },
  12: { 2: 18.60, 5: 18.33, 10: 17.81, 20: 16.75, 40: 14.63 }
};

/**
 * Comisiones de Tarjeta Naranja por plazo de acreditación
 */
export const NARANJA_COMMISSIONS: Record<number, number> = { 
  2: 5.79, 
  5: 3.39, 
  10: 3.39, 
  20: 0.0, 
  40: 0.0 
};

/**
 * Tasas de financiación de Tarjeta Naranja por cuotas
 */
export const NARANJA_FINANCE: Record<number, number> = { 
  1: 0.0, 
  2: 0.0, 
  3: 10.39, 
  4: 0.0, 
  5: 0.0, 
  6: 17.69, 
  7: 0.0, 
  8: 0.0, 
  9: 23.52, 
  10: 0.0, 
  11: 0.0, 
  12: 29.08 
};

/**
 * Comisión fija de Payway
 */
export const PAYWAY_COMMISSION = 1.8;

/**
 * Coeficientes de Payway sin IVA por cuotas
 */
export const PAYWAY_COEFF_NO_VAT: Record<number, number> = { 
  2: 1.1062, 
  3: 1.1449, 
  4: 1.1844, 
  5: 1.2248, 
  6: 1.2660, 
  7: 0.0, 
  8: 0.0, 
  9: 1.4141, 
  10: 0.0, 
  11: 0.0, 
  12: 1.5575 
};

/**
 * Opciones de plazos de acreditación disponibles
 */
export const SETTLEMENT_OPTIONS = [
  { value: 2, label: "2 días hábiles" },
  { value: 5, label: "5 días hábiles" },
  { value: 10, label: "10 días hábiles" },
  { value: 20, label: "20 días hábiles" },
  { value: 40, label: "40 días hábiles" }
];

/**
 * Tipos de tarjetas disponibles
 */
export const CARD_TYPES = [
  { value: "viumi", label: "Banco Macro (viüMi)" },
  { value: "naranja", label: "Tarjeta Naranja" },
  { value: "payway", label: "Banco de Corrientes (Payway)" },
  { value: "otro", label: "Otro banco (elige la mejor opción)" }
];

// ==========================================
// CONSTANTES DE CARTOLA
// ==========================================

/**
 * Estilos disponibles para cartolas
 */
export const CARTOLA_STYLES = {
  MODERN: 'modern',
  ORIGINAL: 'original',
  MINIMAL: 'minimal',
  GRADIENT: 'gradient',
  DARK: 'dark',
  GEOMETRIC: 'geometric',
  WELLNESS: 'wellness',
  SALE: 'sale',
  DELICATE: 'delicate'
} as const;

/**
 * Etiquetas visibles para cada estilo de cartola
 */
export const CARTOLA_STYLE_LABELS: Record<string, string> = {
  modern: 'Modern',
  original: 'Original',
  minimal: 'Minimal',
  gradient: 'Gradiente',
  dark: 'Oscuro',
  geometric: 'Geométrico',
  wellness: 'Bienestar',
  sale: 'Oferta',
  delicate: 'Delicado',
};

/**
 * Colores de degradado para los estilos de cartola
 */
export const CARTOLA_STYLE_COLORS: Record<string, [string, string]> = {
  modern: ['#667eea', '#764ba2'],
  original: ['#3b82f6', '#1e40af'],
  minimal: ['#f8fafc', '#f1f5f9'],
  gradient: ['#ec4899', '#f43f5e'],
  dark: ['#111827', '#1f2937'],
  geometric: ['#0ea5e9', '#0284c7'],
  wellness: ['#34d399', '#059669'],
  sale: ['#f87171', '#dc2626'],
  delicate: ['#fbcfe8', '#f9a8d4'],
};

// ==========================================
// CONSTANTES DE CONFIGURACIÓN DE TIENDA
// ==========================================

/**
 * Datos por defecto para nuevas tiendas
 */
export const DEFAULT_STORE_DATA: StoreData = {
  name: "Mi Tienda",
  location: "Av. Principal 123, Centro",
  phone: "(0379) 123-4567",
  email: "info@mitienda.com",
  hours: "Lun-Vie 9:00-18:00, Sáb 9:00-13:00",
};

// ==========================================
// CONSTANTES DE VALIDACIÓN
// ==========================================

/**
 * Longitudes mínimas para campos de texto
 */
export const MIN_LENGTHS = {
  USERNAME: 3,
  PASSWORD: 4,
  BUSINESS_NAME: 3,
  PRODUCT_NAME: 2,
  PRODUCT_CODE: 1
} as const;

/**
 * Expresiones regulares para validación
 */
export const REGEX_PATTERNS = {
  EMAIL: /\S+@\S+\.\S+/,
  PHONE: /^[\d\s\-\+\(\)]+$/,
  IMAGE_URL: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  NUMERIC_CODE: /^\d+$/
} as const;

// ==========================================
// CONSTANTES DE UI
// ==========================================

/**
 * Breakpoints para responsive design
 */
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px', 
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;

/**
 * Z-index layers para modales y overlays
 */
export const Z_INDEX = {
  HEADER: 40,
  MODAL: 50,
  TOAST: 50,
  OVERLAY: 45
} as const;

/**
 * Colores del tema
 */
export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  SUCCESS: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a'
  },
  ERROR: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626'
  },
  WARNING: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706'
  }
} as const;

/**
 * Tamaños de fuente estándar
 */
export const FONT_SIZES = {
  XS: '0.75rem',
  SM: '0.875rem',
  BASE: '1rem',
  LG: '1.125rem',
  XL: '1.25rem',
  '2XL': '1.5rem',
  '3XL': '1.875rem'
} as const;

// ==========================================
// CONSTANTES DE ARCHIVOS Y FORMATOS
// ==========================================

/**
 * Tipos de archivos aceptados para importación
 */
export const ACCEPTED_FILE_TYPES = {
  JSON: '.json',
  CSV: '.csv',
  EXCEL: '.xlsx,.xls',
  IMAGES: '.jpg,.jpeg,.png,.gif,.webp'
} as const;

/**
 * Tamaños máximos de archivos en bytes
 */
export const MAX_FILE_SIZES = {
  JSON: 10 * 1024 * 1024, // 10MB
  CSV: 5 * 1024 * 1024,   // 5MB
  IMAGE: 2 * 1024 * 1024  // 2MB
} as const;

// ==========================================
// CONSTANTES DE MENSAJES
// ==========================================

/**
 * Mensajes de éxito
 */
export const SUCCESS_MESSAGES = {
  USER_CREATED: (businessName: string) => `¡Bienvenido ${businessName}! Usuario creado exitosamente`,
  USER_LOGGED_IN: (businessName: string) => `¡Bienvenido de vuelta, ${businessName}!`,
  USER_LOGGED_OUT: 'Sesión cerrada exitosamente',
  DATA_EXPORTED: '¡Datos exportados exitosamente!',
  DATA_IMPORTED: '¡Datos importados exitosamente!',
  DATA_RESET: '¡Datos restablecidos a valores por defecto!',
  PRICES_UPDATED: '¡Precios actualizados exitosamente!',
  STORE_DATA_UPDATED: '¡Datos de la tienda actualizados correctamente!',
  PRODUCT_SAVED: '¡Producto guardado exitosamente!',
  PRODUCT_DELETED: '¡Producto eliminado exitosamente!'
} as const;

/**
 * Mensajes de error
 */
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Usuario o contraseña incorrectos',
  USER_EXISTS: 'El usuario ya existe, intenta con otro nombre',
  REQUIRED_USERNAME: 'El usuario es requerido',
  REQUIRED_PASSWORD: 'La contraseña es requerida',
  REQUIRED_BUSINESS_NAME: 'El nombre del negocio es requerido',
  USERNAME_TOO_SHORT: 'El usuario debe tener al menos 3 caracteres',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 4 caracteres',
  BUSINESS_NAME_TOO_SHORT: 'El nombre del negocio debe tener al menos 3 caracteres',
  INVALID_FILE: 'Error al procesar el archivo. Verifica el formato.',
  INVALID_PRICES_FILE: 'Error al actualizar precios. Verifica el archivo.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado'
} as const;

/**
 * Mensajes de confirmación
 */
export const CONFIRMATION_MESSAGES = {
  DELETE_PRODUCT: '¿Estás seguro de que quieres eliminar este producto?',
  LOGOUT: '¿Estás seguro que quieres cerrar sesión?',
  RESET_DATA: '¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer.',
  UNSAVED_CHANGES: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres continuar?'
} as const;

// ==========================================
// CONSTANTES DE CONFIGURACIÓN DE APLICACIÓN
// ==========================================

/**
 * Configuración general de la aplicación
 */
export const APP_CONFIG = {
  NAME: 'Casa de Colchones',
  VERSION: '1.0.0',
  AUTHOR: 'Tu Empresa',
  DESCRIPTION: 'Sistema de gestión para tiendas de colchones',
  DEFAULT_LANGUAGE: 'es-AR',
  DEFAULT_CURRENCY: 'ARS'
} as const;

/**
 * URLs y endpoints (para futuro uso con APIs)
 */
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  USERS: '/api/users',
  EXPORT: '/api/export',
  IMPORT: '/api/import'
} as const;

/**
 * Configuración de localStorage
 */
export const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  APP_USERS: 'app_users',
  USER_PREFIX: 'user_',
  STORE_DATA: 'storeData',
  PRODUCTS: 'products',
  SAVED_CARTOLAS: 'savedCartolas'
} as const;