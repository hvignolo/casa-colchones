import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Settings,
  Bed,
  User,
  LogOut,
  Calculator,
  FilePlus,
} from "lucide-react";

// Importamos los componentes y datos refactorizados
import { Product, StoreData, User as UserType } from "./types";
import { defaultProducts } from "./defaultProducts";
import { FILTER_CHIPS } from "./components/IconComponents";
import {
  TARJETA_FACTOR,
  SOMMIER_MAPPING,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  CONFIRMATION_MESSAGES,
  DEFAULT_STORE_DATA,
  TOAST_DURATION
} from "./constants";
import LoginForm from "./LoginForm";
import ProductDetailModal from "./ProductDetailModal";
import PaymentCalculatorModal from "./PaymentCalculatorModal";
import SettingsModal from "./SettingsModal";
import CartolaModal from "./CartolaModal";
import ConnectionIndicator from "./ConnectionIndicator";
import { useOffline } from "./useOffline";
import { productToCartolaData, getCartolaStyleByProductType } from "./cartolaIntegration";
import { ProductImage } from "./ProductImage";

// Tipos para la integración
interface CalculatorPreloadData {
  amount: number;
  cardType: string;
  installments: number;
  settlement: number;
  useMacro: boolean;
  useMiPyMe: boolean;
}

// Componente para iconos que no están en lucide-react (temporalmente aquí hasta que se mueva a IconComponents)
const Armchair: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const [showSettings, setShowSettings] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCartola, setShowCartola] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Estados para la integración
  const [calculatorPreloadData, setCalculatorPreloadData] = useState<CalculatorPreloadData | undefined>(undefined);
  const [cartolaPreloadData, setCartolaPreloadData] = useState<any>(undefined);

  // Hook para funcionalidad offline
  const {
    isOnline,
    isLoading: offlineLoading,
    saveProductsOffline,
    loadProductsOffline,
    saveStoreDataOffline,
    loadStoreDataOffline,
    saveUserOffline,
    loadUserOffline,
    loadAllUsersOffline,
    addOfflineAction,
    clearOldData
  } = useOffline();

  // Datos de la tienda con persistencia offline
  const [storeData, setStoreData] = useState<StoreData>(DEFAULT_STORE_DATA);

  // Datos de productos con persistencia offline
  const [products, setProducts] = useState<Product[]>([]);

  // Registrar Service Worker - Versión para producción y GitHub Pages
  useEffect(() => {
    // Habilitar Service Worker en producción
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Usar la ruta correcta basada en PUBLIC_URL
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
      
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registrado:', registration.scope);
          
          // Verificar actualizaciones cada hora
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60);
        })
        .catch((error) => {
          console.log('Error registrando Service Worker:', error);
        });
    } else {
      console.log('Service Worker deshabilitado en desarrollo');
    }
  }, []);

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadInitialUser = async () => {
      const savedUserData = localStorage.getItem("currentUser");
      if (savedUserData) {
        try {
          const savedUser = JSON.parse(savedUserData);
          
          // Verificar que el usuario existe offline
          const offlineUser = await loadUserOffline(savedUser.username);
          if (offlineUser) {
            setCurrentUser(offlineUser);
            setShowLogin(false);
          } else {
            // Si no existe offline, usar los datos guardados y guardarlo offline
            await saveUserOffline(savedUser);
            setCurrentUser(savedUser);
            setShowLogin(false);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          // Fallback al usuario guardado en localStorage
          setCurrentUser(JSON.parse(savedUserData));
          setShowLogin(false);
        }
      }
    };

    loadInitialUser();
  }, [loadUserOffline, saveUserOffline]);

  // Cargar datos cuando cambie el usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;

      try {
        // Cargar datos de la tienda
        const offlineStoreData = await loadStoreDataOffline(currentUser.username);
        if (offlineStoreData) {
          setStoreData(offlineStoreData);
        } else {
          // Si no hay datos offline, usar los datos por defecto con el nombre del negocio
          const defaultStoreWithName = {
            ...DEFAULT_STORE_DATA,
            name: currentUser.businessName,
          };
          setStoreData(defaultStoreWithName);
          await saveStoreDataOffline(defaultStoreWithName, currentUser.username);
        }

        // Cargar productos
        const offlineProducts = await loadProductsOffline(currentUser.username);
        if (offlineProducts.length > 0) {
          setProducts(offlineProducts);
        } else {
          // Si no hay productos offline, usar los productos por defecto
          setProducts(defaultProducts);
          await saveProductsOffline(defaultProducts, currentUser.username);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback a localStorage
        const fallbackStoreData = loadFromLocalStorage("storeData", {
          ...DEFAULT_STORE_DATA,
          name: currentUser.businessName,
        });
        setStoreData(fallbackStoreData);
        
        const fallbackProducts = loadFromLocalStorage("products", defaultProducts);
        setProducts(fallbackProducts);
      }
    };

    loadUserData();
  }, [currentUser, loadStoreDataOffline, saveStoreDataOffline, loadProductsOffline, saveProductsOffline]);

  // Guardar datos automáticamente offline
  useEffect(() => {
    const saveData = async () => {
      if (currentUser && storeData.name && !offlineLoading) {
        try {
          await saveStoreDataOffline(storeData, currentUser.username);
          // También guardar en localStorage como fallback
          saveToLocalStorage("storeData", storeData);
        } catch (error) {
          console.error('Error saving store data offline:', error);
        }
      }
    };

    saveData();
  }, [storeData, currentUser, saveStoreDataOffline, offlineLoading]);

  useEffect(() => {
    const saveData = async () => {
      if (currentUser && products.length > 0 && !offlineLoading) {
        try {
          await saveProductsOffline(products, currentUser.username);
          // También guardar en localStorage como fallback
          saveToLocalStorage("products", products);
        } catch (error) {
          console.error('Error saving products offline:', error);
        }
      }
    };

    saveData();
  }, [products, currentUser, saveProductsOffline, offlineLoading]);

  // Limpiar datos antiguos periódicamente
  useEffect(() => {
    const cleanup = setInterval(() => {
      clearOldData();
    }, 24 * 60 * 60 * 1000); // Cada 24 horas

    return () => clearInterval(cleanup);
  }, [clearOldData]);

  // Funciones para localStorage con prefijo de usuario
  const getUserKey = (key: string) => `user_${currentUser?.username}_${key}`;

  const saveToLocalStorage = (key: string, data: any) => {
    if (!currentUser) return;
    try {
      localStorage.setItem(getUserKey(key), JSON.stringify(data));
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  };

  const loadFromLocalStorage = (key: string, defaultValue: any) => {
    if (!currentUser) return defaultValue;
    try {
      const saved = localStorage.getItem(getUserKey(key));
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error("Error cargando desde localStorage:", error);
      return defaultValue;
    }
  };

  // Funciones de autenticación con soporte offline
  const getUsers = async (): Promise<Record<string, UserType>> => {
    try {
      return await loadAllUsersOffline();
    } catch (error) {
      // Fallback a localStorage
      const users = localStorage.getItem("app_users");
      return users ? JSON.parse(users) : {};
    }
  };

  const saveUsers = async (users: Record<string, UserType>) => {
    try {
      // Guardar cada usuario individualmente offline
      for (const user of Object.values(users)) {
        await saveUserOffline(user);
      }
      // También guardar en localStorage
      localStorage.setItem("app_users", JSON.stringify(users));
    } catch (error) {
      console.error("Error guardando usuarios:", error);
      // Fallback a localStorage
      localStorage.setItem("app_users", JSON.stringify(users));
    }
  };

  const handleLogin = async (username: string, password: string, businessName: string): Promise<boolean> => {
    const users = await getUsers();

    // Determinar si es registro basado en si el usuario ya existe
    const isRegister = !users[username];

    if (isRegister) {
      const newUser: UserType = {
        username,
        password,
        businessName,
        registeredAt: new Date().toISOString(),
      };

      users[username] = newUser;
      await saveUsers(users);

      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setShowLogin(false);
      showToastMessage(
        `¡Bienvenido ${businessName}! Usuario creado exitosamente`
      );

      // Registrar acción offline si no hay conexión
      if (!isOnline) {
        await addOfflineAction({
          type: 'USER_REGISTER',
          user: newUser
        }, username);
      }

      return true;
    } else {
      const user = users[username];
      if (user && user.password === password) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setShowLogin(false);
        showToastMessage(`¡Bienvenido de vuelta, ${user.businessName}!`);

        // Registrar acción offline si no hay conexión
        if (!isOnline) {
          await addOfflineAction({
            type: 'USER_LOGIN',
            user: user
          }, username);
        }

        return true;
      } else {
        return false;
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro que quieres cerrar sesión?")) {
      // Registrar acción offline si no hay conexión
      if (!isOnline && currentUser) {
        await addOfflineAction({
          type: 'USER_LOGOUT',
          user: currentUser
        }, currentUser.username);
      }

      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      setShowLogin(true);
      setSearchQuery("");
      setActiveFilter("TODOS");
      setShowSettings(false);
      setSelectedProduct(null);
      showToastMessage("Sesión cerrada exitosamente");
    }
  };

  // Función para formatear precios con punto como separador de miles y coma
  // como separador decimal, usando dos decimales.
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Importar lista de precios desde un archivo CSV
  const importPriceList = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter((ln) => ln.trim());
        const priceMap: Record<string, number> = {};
        
        lines.forEach((line) => {
          const cols = line.split(",");
          const codeRaw = cols[0]?.trim();
          const priceStr = cols[3]?.trim();
          
          if (codeRaw && !isNaN(Number(codeRaw)) && priceStr && !isNaN(parseFloat(priceStr))) {
            const normalizedCode = parseInt(codeRaw, 10).toString();
            priceMap[normalizedCode] = parseFloat(priceStr);
          }
        });
        
        const updatedProducts = products.map((p) => {
          if (p.tipo === "SOMMIERS") return p;
          const newPrice = priceMap[p.codigo];
          if (newPrice != null) {
            const contadoPublic = Math.round((newPrice * 2 + Number.EPSILON) * 100) / 100;
            const newTarjeta = Math.round((contadoPublic * TARJETA_FACTOR + Number.EPSILON) * 100) / 100;
            return { ...p, precioContado: contadoPublic, precioTarjeta: newTarjeta };
          }
          return p;
        }).map((p) => {
          if (p.tipo !== "SOMMIERS") return p;
          const combo = SOMMIER_MAPPING[p.codigo];
          if (!combo) return p;
          let sum = 0;
          combo.forEach((code) => {
            const item = products.find((it) => it.codigo === code);
            if (item) {
              sum += item.precioContado;
            }
          });
          sum = Math.round((sum + Number.EPSILON) * 100) / 100;
          const newTarjeta = Math.round((sum * TARJETA_FACTOR + Number.EPSILON) * 100) / 100;
          return { ...p, precioContado: sum, precioTarjeta: newTarjeta };
        });

        setProducts(updatedProducts);

        // Registrar acción offline si no hay conexión
        if (!isOnline && currentUser) {
          await addOfflineAction({
            type: 'IMPORT_PRICES',
            priceMap,
            timestamp: Date.now()
          }, currentUser.username);
        }

        showToastMessage(SUCCESS_MESSAGES.PRICES_UPDATED);
      } catch (error) {
        console.error(error);
        showToastMessage(ERROR_MESSAGES.INVALID_PRICES_FILE);
      }
    };
    reader.readAsText(file);
  };

  const filterChips = FILTER_CHIPS;

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeFilter !== "TODOS") {
      if (activeFilter === "RESORTES") {
        filtered = filtered.filter(p => (p.tipo === 'COLCHONES' || p.tipo === 'SOMMIERS') && p.subtipo.toLowerCase().includes("resortes"));
      } else if (activeFilter === "ESPUMA") {
        filtered = filtered.filter(p => (p.tipo === 'COLCHONES' || p.tipo === 'SOMMIERS') && p.subtipo.toLowerCase().includes("espuma"));
      } else {
        filtered = filtered.filter((product) => product.tipo === activeFilter);
      }
    }

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

    return filtered;
  }, [activeFilter, searchQuery, products]);

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm(CONFIRMATION_MESSAGES.DELETE_PRODUCT)) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);

      // Registrar acción offline si no hay conexión
      if (!isOnline && currentUser) {
        await addOfflineAction({
          type: 'DELETE_PRODUCT',
          productId: id
        }, currentUser.username);
      }
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts([...products, newProduct]);

    // Registrar acción offline si no hay conexión
    if (!isOnline && currentUser) {
      await addOfflineAction({
        type: 'ADD_PRODUCT',
        product: newProduct
      }, currentUser.username);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  // Función para abrir el calculador con datos precargados
  const handleOpenCalculator = (preloadData?: CalculatorPreloadData) => {
    setCalculatorPreloadData(preloadData);
    setShowCalculator(true);
  };

  // Función para crear cartola desde producto
  const handleCreateCartolaFromProduct = (product: Product) => {
    const cartolaData = productToCartolaData(product);
    const estilo = getCartolaStyleByProductType(product.tipo);
    
    setCartolaPreloadData({
      data: cartolaData,
      estilo: estilo
    });
    
    // Cerrar el modal de detalle del producto antes de abrir la cartola
    setSelectedProduct(null);
    setShowCartola(true);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, TOAST_DURATION);
  };

  // Funciones para exportar/importar datos
  const exportData = async () => {
    const data = {
      products,
      storeData,
      user: currentUser?.username,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentUser?.username}-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Registrar acción offline si no hay conexión
    if (!isOnline && currentUser) {
      await addOfflineAction({
        type: 'EXPORT_DATA',
        timestamp: Date.now()
      }, currentUser.username);
    }

    showToastMessage(SUCCESS_MESSAGES.DATA_EXPORTED);
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.products) {
          setProducts(data.products);
        }
        if (data.storeData) {
          setStoreData(data.storeData);
        }

        // Registrar acción offline si no hay conexión
        if (!isOnline && currentUser) {
          await addOfflineAction({
            type: 'IMPORT_DATA',
            data: data,
            timestamp: Date.now()
          }, currentUser.username);
        }

        showToastMessage(SUCCESS_MESSAGES.DATA_IMPORTED);
      } catch (error) {
        showToastMessage(ERROR_MESSAGES.INVALID_FILE);
      }
    };
    reader.readAsText(file);
  };

  const resetData = async () => {
    if (window.confirm(CONFIRMATION_MESSAGES.RESET_DATA)) {
      const defaultStoreWithName = {
        ...DEFAULT_STORE_DATA,
        name: currentUser?.businessName || DEFAULT_STORE_DATA.name,
      };

      setProducts(defaultProducts);
      setStoreData(defaultStoreWithName);

      // Registrar acción offline si no hay conexión
      if (!isOnline && currentUser) {
        await addOfflineAction({
          type: 'RESET_DATA',
          timestamp: Date.now()
        }, currentUser.username);
      }

      showToastMessage(SUCCESS_MESSAGES.DATA_RESET);
    }
  };

  // Componente Toast
  const Toast: React.FC = () => {
    if (!showToast) return null;

    return (
      <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
        <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{toastMessage}</span>
        </div>
      </div>
    );
  };

  // Si no hay usuario logueado, mostrar el login
  if (showLogin || !currentUser) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        onShowToast={showToastMessage} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">
                {storeData.name}
              </h1>
              <span className="text-sm text-gray-500">•</span>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {currentUser.username}
                </span>
              </div>
              {/* Indicador de conexión */}
              <ConnectionIndicator className="ml-4" />
            </div>
            <div className="flex items-center gap-2">
              {/* Botón de calculadora para abrir el modal de cuotas */}
              <button
                onClick={() => handleOpenCalculator()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Calculadora de cuotas"
              >
                <Calculator className="w-6 h-6 text-gray-600" />
              </button>
              {/* Botón para crear cartola de precios */}
              <button
                onClick={() => setShowCartola(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Crear cartola de precios"
              >
                <FilePlus className="w-6 h-6 text-gray-600" />
              </button>
              {/* Botón de configuración */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Configuración"
              >
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
              {/* Botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="main-search-input"
              name="search"
              placeholder="Buscar por código, nombre, marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              autoComplete="off"
            />
            {/* Indicador de modo offline en el search bar */}
            {!isOnline && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span>Offline</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Filter Chips */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterChips.map((chip) => {
            const IconComponent = chip.icon;
            const isActive = activeFilter === chip.id;

            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <main className="pb-8">
        {/* Loading indicator */}
        {offlineLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3 text-blue-600">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Cargando datos...</span>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && !offlineLoading ? (
          <div className="text-center py-12 px-4">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            <p className="text-gray-400 text-sm mt-2">
              Intenta con otros términos de búsqueda
            </p>
            {!isOnline && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-orange-700 text-sm">
                  <strong>Modo offline:</strong> Solo se muestran productos guardados localmente
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden xl:block">
              <div className="bg-white mx-4 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 min-w-[200px]">
                          Producto
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Código
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Tipo
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Medidas
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Marca
                        </th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-900">
                          Precio Contado
                        </th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-900">
                          Precio Tarjeta
                        </th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <ProductImage
                                  src={product.image}
                                  alt={product.nombre}
                                  tipo={product.tipo}
                                  className="w-full h-full"
                                  size="small"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {product.nombre}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {product.subtipo}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 font-mono">
                            {product.codigo}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.tipo}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {product.medidas}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {product.marca}
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-semibold text-green-600">
                            ${formatPrice(product.precioContado)}
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-semibold text-blue-600">
                            ${formatPrice(product.precioTarjeta)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleViewProduct(product)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tablet List */}
            <div className="hidden lg:block xl:hidden px-4 space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewProduct(product)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <ProductImage
                        src={product.image}
                        alt={product.nombre}
                        tipo={product.tipo}
                        className="w-full h-full"
                        size="medium"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                            {product.nombre}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {product.subtipo} • {product.marca}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {product.codigo}
                          </p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-green-600 font-bold text-sm">
                            ${formatPrice(product.precioContado)}
                          </p>
                          <p className="text-xs text-blue-600">
                            ${formatPrice(product.precioTarjeta)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.tipo}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {product.medidas}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden px-4 space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewProduct(product)}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <ProductImage
                        src={product.image}
                        alt={product.nombre}
                        tipo={product.tipo}
                        className="w-full h-full"
                        size="medium"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {product.nombre}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {product.subtipo}
                          </p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <p className="text-green-600 font-bold text-sm">
                            ${formatPrice(product.precioContado)}
                          </p>
                          <p className="text-xs text-blue-600">
                            ${formatPrice(product.precioTarjeta)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Código:</span>
                          <span className="ml-1 font-mono font-medium">
                            {product.codigo}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Marca:</span>
                          <span className="ml-1 font-medium">
                            {product.marca}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Medidas:</span>
                          <span className="ml-1 font-medium">
                            {product.medidas}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.tipo}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Toast Notification */}
      <Toast />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentUser={currentUser}
        storeData={storeData}
        products={products}
        onUpdateStoreData={setStoreData}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={() => {}} // No se usa en este flujo simplificado
        onExportData={exportData}
        onImportData={importData}
        onResetData={resetData}
        onImportPriceList={importPriceList}
        onShowToast={showToastMessage}
        formatPrice={formatPrice}
      />

      {/* Calculator Modal */}
      <PaymentCalculatorModal 
        isOpen={showCalculator} 
        onClose={() => {
          setShowCalculator(false);
          setCalculatorPreloadData(undefined);
        }}
        preloadData={calculatorPreloadData}
      />

      {/* Cartola de precios Modal */}
      <CartolaModal 
        open={showCartola} 
        onClose={() => {
          setShowCartola(false);
          setCartolaPreloadData(undefined);
        }}
        preloadData={cartolaPreloadData}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          storeData={storeData}
          onClose={handleCloseProductDetail}
          onOpenCalculator={handleOpenCalculator}
          onCreateCartola={handleCreateCartolaFromProduct}
        />
      )}
    </div>
  );
};

export default App;