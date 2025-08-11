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
import { productToCartolaData, getCartolaStyleByProductType } from "./cartolaIntegration";

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

  // Verificar si hay usuario logueado al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setShowLogin(false);
    }
  }, []);

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

  // Funciones de autenticación
  const getUsers = (): Record<string, UserType> => {
    try {
      const users = localStorage.getItem("app_users");
      return users ? JSON.parse(users) : {};
    } catch (error) {
      return {};
    }
  };

  const saveUsers = (users: Record<string, UserType>) => {
    try {
      localStorage.setItem("app_users", JSON.stringify(users));
    } catch (error) {
      console.error("Error guardando usuarios:", error);
    }
  };

  const handleLogin = (username: string, password: string, businessName: string): boolean => {
    const users = getUsers();

    // Determinar si es registro basado en si el usuario ya existe
    const isRegister = !users[username];

    if (isRegister) {
      users[username] = {
        username,
        password,
        businessName,
        registeredAt: new Date().toISOString(),
      };
      saveUsers(users);

      const newUser = users[username];
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setShowLogin(false);
      showToastMessage(
        `¡Bienvenido ${businessName}! Usuario creado exitosamente`
      );
      return true;
    } else {
      const user = users[username];
      if (user && user.password === password) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setShowLogin(false);
        showToastMessage(`¡Bienvenido de vuelta, ${user.businessName}!`);
        return true;
      } else {
        return false;
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que quieres cerrar sesión?")) {
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

  // Datos de la tienda con persistencia por usuario
  const [storeData, setStoreData] = useState<StoreData>(() => {
    if (!currentUser) return DEFAULT_STORE_DATA;
    return loadFromLocalStorage("storeData", {
      ...DEFAULT_STORE_DATA,
      name: currentUser?.businessName || DEFAULT_STORE_DATA.name,
    });
  });

  // Datos de productos con persistencia por usuario
  const [products, setProducts] = useState<Product[]>(() => {
    if (!currentUser) return [];
    return loadFromLocalStorage("products", defaultProducts);
  });

  // Recargar datos cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      const userData = loadFromLocalStorage("storeData", {
        ...DEFAULT_STORE_DATA,
        name: currentUser.businessName,
      });
      setStoreData(userData);

      const userProducts = loadFromLocalStorage("products", defaultProducts);
      setProducts(userProducts);
    }
  }, [currentUser]);

  // Guardar datos automáticamente cuando cambien
  useEffect(() => {
    if (currentUser && storeData.name) {
      saveToLocalStorage("storeData", storeData);
    }
  }, [storeData, currentUser]);

  useEffect(() => {
    if (currentUser && products.length > 0) {
      saveToLocalStorage("products", products);
    }
  }, [products, currentUser]);

  // Función para formatear precios con punto como separador de miles y coma
  // como separador decimal, usando dos decimales.
  const formatPrice = (value: number) => {
    return value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Importar lista de precios desde un archivo CSV
  const importPriceList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
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
        
        setProducts((prevProducts) => {
          let updated = prevProducts.map((p) => {
            if (p.tipo === "SOMMIERS") return p;
            const newPrice = priceMap[p.codigo];
            if (newPrice != null) {
              const contadoPublic = Math.round((newPrice * 2 + Number.EPSILON) * 100) / 100;
              const newTarjeta = Math.round((contadoPublic * TARJETA_FACTOR + Number.EPSILON) * 100) / 100;
              return { ...p, precioContado: contadoPublic, precioTarjeta: newTarjeta };
            }
            return p;
          });
          
          updated = updated.map((p) => {
            if (p.tipo !== "SOMMIERS") return p;
            const combo = SOMMIER_MAPPING[p.codigo];
            if (!combo) return p;
            let sum = 0;
            combo.forEach((code) => {
              const item = updated.find((it) => it.codigo === code);
              if (item) {
                sum += item.precioContado;
              }
            });
            sum = Math.round((sum + Number.EPSILON) * 100) / 100;
            const newTarjeta = Math.round((sum * TARJETA_FACTOR + Number.EPSILON) * 100) / 100;
            return { ...p, precioContado: sum, precioTarjeta: newTarjeta };
          });
          
          return updated;
        });
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

  const handleDeleteProduct = (id: number) => {
    if (window.confirm(CONFIRMATION_MESSAGES.DELETE_PRODUCT)) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts([...products, newProduct]);
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
  const exportData = () => {
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

    showToastMessage(SUCCESS_MESSAGES.DATA_EXPORTED);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.products) {
          setProducts(data.products);
        }
        if (data.storeData) {
          setStoreData(data.storeData);
        }

        showToastMessage(SUCCESS_MESSAGES.DATA_IMPORTED);
      } catch (error) {
        showToastMessage(ERROR_MESSAGES.INVALID_FILE);
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (window.confirm(CONFIRMATION_MESSAGES.RESET_DATA)) {
      setProducts(defaultProducts);
      setStoreData({
        ...DEFAULT_STORE_DATA,
        name: currentUser?.businessName || DEFAULT_STORE_DATA.name,
      });
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
              placeholder="Buscar por código, nombre, marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
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
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            <p className="text-gray-400 text-sm mt-2">
              Intenta con otros términos de búsqueda
            </p>
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
                                <img
                                  src={product.image}
                                  alt={product.nombre}
                                  className="w-full h-full object-cover"
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
                      <img
                        src={product.image}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
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
                      <img
                        src={product.image}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
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