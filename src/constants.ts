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
 * Configuración básica de los chips de filtros (ACTUALIZADA con nuevos iconos)
 * Los iconos se asignarán en el componente que los use
 */
export const FILTER_CHIPS_CONFIG = [
  { id: "TODOS", label: "Todos", iconType: "Grid3X3" },
  { id: "COLCHONES", label: "Colchones", iconType: "Bed" },
  { id: "SOMMIERS", label: "Sommiers", iconType: "SommierIcon" },
  { id: "RESORTES", label: "Resortes", iconType: "SpringIcon" },
  { id: "ESPUMA", label: "Espuma", iconType: "FoamIcon" },
  { id: "RESPALDOS", label: "Respaldos", iconType: "BackrestIcon" },
  { id: "ALMOHADAS", label: "Almohadas", iconType: "PillowIcon" },
  { id: "OTROS", label: "Otros", iconType: "Package" },
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
  PHONE: /^[\d\s\-+()]+$/,
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
  PRODUCT_DELETED: '¡Producto eliminado exitosamente!',
  // NUEVOS MENSAJES PARA FUNCIONALIDAD OFFLINE
  SYNC_COMPLETE: '✅ Sincronización completada',
  OFFLINE_MODE_ACTIVE: '🔄 Modo offline activado - Los datos se guardarán localmente',
  ONLINE_MODE_RESTORED: '🌐 Conexión restaurada - Sincronizando datos...',
  // NUEVOS MENSAJES PARA IMPORTACIÓN XML
  XML_IMPORT_SUCCESS: (count: number) => `✓ ${count} productos procesados desde XML`,
  XML_PRICES_UPDATED: (count: number) => `¡Precios actualizados exitosamente! (${count} productos procesados desde XML)`
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
  INVALID_XML_FILE: 'Error al procesar el archivo XML. Verifica el formato.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado',
  // NUEVOS MENSAJES PARA FUNCIONALIDAD OFFLINE
  NETWORK_ERROR: '❌ Error de conexión - Funcionando en modo offline',
  SYNC_ERROR: '❌ Error durante la sincronización',
  STORAGE_ERROR: '❌ Error al guardar datos localmente',
  LOAD_ERROR: '❌ Error al cargar datos'
} as const;

/**
 * Mensajes de error específicos para XML
 */
export const XML_ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'El archivo debe tener extensión .xml',
  PARSE_ERROR: 'Error al parsear el archivo XML. Verifica que el formato sea válido',
  NO_PRODUCTS_FOUND: 'No se encontraron productos válidos en el archivo XML',
  MISSING_REQUIRED_FIELDS: 'Algunos productos no tienen los campos requeridos (código y precio)',
  ENCODING_ERROR: 'Error de codificación. Asegúrate de que el archivo use UTF-8',
  EMPTY_FILE: 'El archivo XML está vacío',
  MALFORMED_XML: 'El XML está mal formado. Verifica que todas las etiquetas estén cerradas correctamente',
} as const;

/**
 * Mensajes de confirmación
 */
export const CONFIRMATION_MESSAGES = {
  DELETE_PRODUCT: '¿Estás seguro de que quieres eliminar este producto?',
  LOGOUT: '¿Estás seguro que quieres cerrar sesión?',
  RESET_DATA: '¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer.',
  UNSAVED_CHANGES: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres continuar?',
  // NUEVOS MENSAJES PARA FUNCIONALIDAD OFFLINE
  CLEAR_CACHE: '¿Deseas limpiar el caché de la aplicación?'
} as const;

// ==========================================
// CONSTANTES DE CONFIGURACIÓN DE APLICACIÓN
// ==========================================

/**
 * Configuración general de la aplicación
 */
export const APP_CONFIG = {
  NAME: 'La Casa de los Colchones',
  VERSION: '2.0.0', // Actualizada versión para PWA
  AUTHOR: 'Tu Empresa',
  DESCRIPTION: 'Sistema de gestión para tiendas de colchones con funcionalidad offline',
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
  IMPORT: '/api/import',
  // NUEVOS ENDPOINTS PARA FUNCIONALIDAD OFFLINE
  SYNC: '/api/sync'
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
  SAVED_CARTOLAS: 'savedCartolas',
  // NUEVAS CLAVES PARA FUNCIONALIDAD OFFLINE
  OFFLINE_ACTIONS: 'offline_actions_',
  LAST_SYNC: 'last_sync_'
} as const;

// ==========================================
// NUEVAS CONSTANTES PARA FUNCIONALIDAD OFFLINE
// ==========================================

/**
 * Configuración de sincronización offline
 */
export const SYNC_CONFIG = {
  RETRY_INTERVAL: 5000, // 5 segundos para reintentar conexión
  MAX_RETRIES: 3,
  BATCH_SIZE: 50, // Cantidad de elementos a sincronizar por lote
  TIMEOUT: 30000 // 30 segundos timeout para requests
} as const;

/**
 * Configuración de IndexedDB
 */
export const INDEXEDDB_CONFIG = {
  DB_NAME: 'CasaColchonesDB',
  DB_VERSION: 1,
  STORES: {
    PRODUCTS: 'products',
    STORE_DATA: 'storeData',
    USERS: 'users',
    SYNC_QUEUE: 'syncQueue',
    OFFLINE_ACTIONS: 'offlineActions',
    CACHE: 'cache'
  }
} as const;

/**
 * Configuración PWA
 */
export const PWA_CONFIG = {
  THEME_COLOR: '#2563eb',
  BACKGROUND_COLOR: '#ffffff',
  DISPLAY: 'standalone',
  ORIENTATION: 'portrait-primary'
} as const;

/**
 * Configuración de cache offline
 */
export const CACHE_CONFIG = {
  CACHE_NAME: 'casa-colchones-v1',
  DATA_CACHE_NAME: 'casa-colchones-data-v1',
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000 // 24 horas
} as const;

/**
 * Eventos personalizados para la aplicación
 */
export const CUSTOM_EVENTS = {
  CONNECTION_CHANGE: 'connectionchange',
  SYNC_COMPLETE: 'syncComplete',
  DATA_UPDATED: 'dataUpdated',
  USER_LOGOUT: 'userLogout',
  PWA_INSTALL_AVAILABLE: 'pwaInstallAvailable'
} as const;

/**
 * Configuración de imágenes offline
 */
export const IMAGE_CONFIG = {
  PLACEHOLDER_URL: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
  FALLBACK_URLS: {
    COLCHONES: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
    SOMMIERS: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
    RESPALDOS: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop',
    ALMOHADAS: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop',
    OTROS: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop'
  }
} as const;