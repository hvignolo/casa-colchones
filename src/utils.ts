import { User, Product, StoreData, ExportData } from './types';

// ==========================================
// FUNCIONES DE FORMATO Y PRESENTACIÓN
// ==========================================

/**
 * Formatea precios con separador de miles (punto) y decimales (coma)
 * según el formato argentino
 */
export const formatPrice = (value: number): string => {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formatea moneda a formato ARS completo con símbolo
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  });
};

/**
 * Genera un nombre de archivo único basado en el título y fecha actual
 */
export const generateFileName = (baseName: string, extension: string = 'png'): string => {
  const sanitizedBase = baseName.replace(/\s+/g, '_') || 'archivo';
  const fecha = new Date();
  const dateStr = fecha.toLocaleDateString('es-AR').replace(/\//g, '-');
  const timeStr = fecha
    .toLocaleTimeString('es-AR', { hour12: false })
    .replace(/:/g, '-');
  return `${sanitizedBase}_${dateStr}_${timeStr}.${extension}`;
};

// ==========================================
// FUNCIONES DE LOCALSTORAGE
// ==========================================

/**
 * Genera una clave única para localStorage basada en el usuario
 */
export const getUserKey = (username: string, key: string): string => {
  return `user_${username}_${key}`;
};

/**
 * Guarda datos en localStorage con manejo de errores
 */
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error guardando en localStorage (${key}):`, error);
  }
};

/**
 * Carga datos desde localStorage con valor por defecto
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error cargando desde localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Guarda datos específicos de usuario en localStorage
 */
export const saveUserData = (username: string, key: string, data: any): void => {
  const userKey = getUserKey(username, key);
  saveToLocalStorage(userKey, data);
};

/**
 * Carga datos específicos de usuario desde localStorage
 */
export const loadUserData = <T>(username: string, key: string, defaultValue: T): T => {
  const userKey = getUserKey(username, key);
  return loadFromLocalStorage(userKey, defaultValue);
};

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

/**
 * Obtiene todos los usuarios registrados
 */
export const getUsers = (): Record<string, User> => {
  return loadFromLocalStorage("app_users", {});
};

/**
 * Guarda la lista de usuarios
 */
export const saveUsers = (users: Record<string, User>): void => {
  saveToLocalStorage("app_users", users);
};

/**
 * Registra un nuevo usuario
 */
export const registerUser = (username: string, password: string, businessName: string): User => {
  const users = getUsers();
  
  if (users[username]) {
    throw new Error('El usuario ya existe');
  }

  const newUser: User = {
    username,
    password,
    businessName,
    registeredAt: new Date().toISOString(),
  };

  users[username] = newUser;
  saveUsers(users);
  
  return newUser;
};

/**
 * Autentica un usuario existente
 */
export const authenticateUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users[username];
  
  if (user && user.password === password) {
    return user;
  }
  
  return null;
};

/**
 * Guarda el usuario actual en la sesión
 */
export const saveCurrentUser = (user: User): void => {
  saveToLocalStorage("currentUser", user);
};

/**
 * Obtiene el usuario actual de la sesión
 */
export const getCurrentUser = (): User | null => {
  return loadFromLocalStorage("currentUser", null);
};

/**
 * Cierra la sesión del usuario actual
 */
export const logout = (): void => {
  localStorage.removeItem("currentUser");
};

// ==========================================
// FUNCIONES DE PRODUCTOS
// ==========================================

/**
 * Genera un nuevo ID único para un producto
 */
export const generateProductId = (existingProducts: Product[]): number => {
  return Math.max(...existingProducts.map(p => p.id), 0) + 1;
};

/**
 * Filtra productos basado en criterios de búsqueda
 */
export const filterProducts = (
  products: Product[], 
  searchQuery: string, 
  activeFilter: string
): Product[] => {
  let filtered = products;

  // Filtrar por tipo
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
      filtered = filtered.filter(product => product.tipo === activeFilter);
    }
  }

  // Filtrar por texto de búsqueda
  if (searchQuery.trim()) {
    const normalizedQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(product =>
      product.nombre.toLowerCase().includes(normalizedQuery) ||
      product.codigo.toLowerCase().includes(normalizedQuery) ||
      product.marca.toLowerCase().includes(normalizedQuery) ||
      product.subtipo.toLowerCase().includes(normalizedQuery) ||
      product.detalles.toLowerCase().includes(normalizedQuery)
    );
  }

  return filtered;
};

// ==========================================
// FUNCIONES DE IMPORTACIÓN/EXPORTACIÓN
// ==========================================

/**
 * Exporta datos de la aplicación como archivo JSON
 */
export const exportAppData = (
  products: Product[], 
  storeData: StoreData, 
  username: string
): void => {
  const data: ExportData = {
    products,
    storeData,
    user: username,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generateFileName(`${username}-backup`, 'json');
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Procesa un archivo de importación y extrae los datos
 */
export const processImportFile = (file: File): Promise<Partial<ExportData>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Error al procesar el archivo. Verifica que sea un archivo JSON válido.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo.'));
    };
    
    reader.readAsText(file);
  });
};

// ==========================================
// FUNCIONES DE PRECIOS
// ==========================================

// Factor para convertir precio de contado en precio con tarjeta
export const TARJETA_FACTOR = 1.4;

// Mapeo entre códigos de sommiers y los códigos de los productos que lo componen
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

/**
 * Procesa un archivo CSV de precios y devuelve un mapa código -> precio
 */
export const processPriceListCSV = (csvContent: string): Record<string, number> => {
  const lines = csvContent.split(/\r?\n/).filter(ln => ln.trim());
  const priceMap: Record<string, number> = {};
  
  lines.forEach(line => {
    const cols = line.split(",");
    const codeRaw = cols[0]?.trim();
    const priceStr = cols[3]?.trim();
    
    // Solo procesamos códigos numéricos, ignorando filas vacías o de encabezado
    if (codeRaw && !isNaN(Number(codeRaw)) && priceStr && !isNaN(parseFloat(priceStr))) {
      // Normalizar el código: convertir a entero para eliminar decimales y luego a string
      const normalizedCode = parseInt(codeRaw, 10).toString();
      priceMap[normalizedCode] = parseFloat(priceStr);
    }
  });
  
  return priceMap;
};

/**
 * Actualiza los precios de una lista de productos basado en un mapa de precios
 */
export const updateProductPrices = (
  products: Product[], 
  priceMap: Record<string, number>
): Product[] => {
  // Primero actualizar productos individuales (no sommier)
  let updated = products.map(p => {
    if (p.tipo === "SOMMIERS") return p;
    
    const newPrice = priceMap[p.codigo];
    if (newPrice != null) {
      // El precio al público es el doble del precio mayorista
      const contadoPublic = Math.round((newPrice * 2 + Number.EPSILON) * 100) / 100;
      const newTarjeta = Math.round((contadoPublic * TARJETA_FACTOR + Number.EPSILON) * 100) / 100;
      return { ...p, precioContado: contadoPublic, precioTarjeta: newTarjeta };
    }
    
    return p;
  });
  
  // Luego actualizar cada sommier sumando los componentes
  updated = updated.map(p => {
    if (p.tipo !== "SOMMIERS") return p;
    
    const combo = SOMMIER_MAPPING[p.codigo];
    if (!combo) return p;
    
    let sum = 0;
    combo.forEach(code => {
      const item = updated.find(it => it.codigo === code);
      if (item) {
        sum += item.precioContado;
      }
    });
    
    // Precio contado y tarjeta calculados en base a los precios al público de los componentes
    sum = Math.round((sum + Number.EPSILON) * 100) / 100;
    const newTarjeta = Math.round((sum * TARJETA_FACTOR + Number.EPSILON) * 100) / 100;
    return { ...p, precioContado: sum, precioTarjeta: newTarjeta };
  });
  
  return updated;
};

/**
 * Procesa un archivo CSV de precios y actualiza una lista de productos
 */
export const importPriceListFromFile = (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const priceMap = processPriceListCSV(csvContent);
        // Nota: Esta función necesitará la lista actual de productos como parámetro
        // Se puede refactorizar para recibir los productos como parámetro
        reject(new Error('Esta función necesita ser refactorizada para recibir la lista de productos'));
      } catch (error) {
        reject(new Error('Error al procesar el archivo CSV'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
};

// ==========================================
// FUNCIONES DE VALIDACIÓN
// ==========================================

/**
 * Valida los datos de un producto
 */
export const validateProduct = (product: Omit<Product, 'id'>): string[] => {
  const errors: string[] = [];
  
  if (!product.codigo.trim()) {
    errors.push('El código es requerido');
  }
  
  if (!product.nombre.trim()) {
    errors.push('El nombre es requerido');
  }
  
  if (!product.marca.trim()) {
    errors.push('La marca es requerida');
  }
  
  if (!product.medidas.trim()) {
    errors.push('Las medidas son requeridas');
  }
  
  if (product.precioContado <= 0) {
    errors.push('El precio de contado debe ser mayor a 0');
  }
  
  if (product.precioTarjeta <= 0) {
    errors.push('El precio de tarjeta debe ser mayor a 0');
  }
  
  return errors;
};

/**
 * Valida los datos de una tienda
 */
export const validateStoreData = (storeData: StoreData): string[] => {
  const errors: string[] = [];
  
  if (!storeData.name.trim()) {
    errors.push('El nombre de la tienda es requerido');
  }
  
  if (!storeData.location.trim()) {
    errors.push('La ubicación es requerida');
  }
  
  if (!storeData.phone.trim()) {
    errors.push('El teléfono es requerido');
  }
  
  if (!storeData.email.trim()) {
    errors.push('El email es requerido');
  } else if (!/\S+@\S+\.\S+/.test(storeData.email)) {
    errors.push('El email no tiene un formato válido');
  }
  
  if (!storeData.hours.trim()) {
    errors.push('Los horarios son requeridos');
  }
  
  return errors;
};

/**
 * Valida los datos de registro de usuario
 */
export const validateUserRegistration = (
  username: string, 
  password: string, 
  businessName: string
): string[] => {
  const errors: string[] = [];
  
  if (!username.trim()) {
    errors.push('El usuario es requerido');
  } else if (username.length < 3) {
    errors.push('El usuario debe tener al menos 3 caracteres');
  }
  
  if (!password.trim()) {
    errors.push('La contraseña es requerida');
  } else if (password.length < 4) {
    errors.push('La contraseña debe tener al menos 4 caracteres');
  }
  
  if (!businessName.trim()) {
    errors.push('El nombre del negocio es requerido');
  } else if (businessName.length < 3) {
    errors.push('El nombre del negocio debe tener al menos 3 caracteres');
  }
  
  return errors;
};

// ==========================================
// FUNCIONES DE UTILIDAD GENERAL
// ==========================================

/**
 * Crea un delay asíncrono
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce para funciones (útil para search)
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Trunca un texto a una longitud específica
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Capitaliza la primera letra de una cadena
 */
export const capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Normaliza texto para comparaciones (elimina acentos, convierte a minúsculas)
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Elimina acentos
};

/**
 * Verifica si una URL de imagen es válida
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
};

/**
 * Genera un hash simple para identificar cambios en datos
 */
export const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
};