import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ShoppingBag,
  Store,
  Package,
  Upload,
  Plus,
  Edit,
  Trash2,
  Save,
} from 'lucide-react';
import { 
  Product, 
  StoreData, 
  User, 
  SettingsView,
  ProductFormProps 
} from './types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  storeData: StoreData;
  products: Product[];
  onUpdateStoreData: (data: StoreData) => void;
  onSaveProduct: (productData: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: number) => void;
  onEditProduct: (product: Product) => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  onImportPriceList: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShowToast: (message: string) => void;
  formatPrice: (value: number) => string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  storeData,
  products,
  onUpdateStoreData,
  onSaveProduct,
  onDeleteProduct,
  onEditProduct,
  onExportData,
  onImportData,
  onResetData,
  onImportPriceList,
  onShowToast,
  formatPrice
}) => {
  const [settingsView, setSettingsView] = useState<SettingsView>("main");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Generar IDs únicos para los formularios
  const generateId = (base: string) => `${base}-${Math.random().toString(36).substr(2, 9)}`;

  // Componente ProductForm interno
  const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      product || {
        codigo: "",
        nombre: "",
        medidas: "",
        tipo: "COLCHONES",
        subtipo: "",
        precioContado: 0,
        precioTarjeta: 0,
        detalles: "",
        image: "",
        marca: "",
      }
    );

    // IDs únicos para este formulario
    const formIds = {
      codigo: generateId('product-codigo'),
      nombre: generateId('product-nombre'),
      marca: generateId('product-marca'),
      tipo: generateId('product-tipo'),
      subtipo: generateId('product-subtipo'),
      medidas: generateId('product-medidas'),
      precioContado: generateId('product-precio-contado'),
      precioTarjeta: generateId('product-precio-tarjeta'),
      image: generateId('product-image'),
      detalles: generateId('product-detalles'),
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        precioContado: Number(formData.precioContado),
        precioTarjeta: Number(formData.precioTarjeta),
      });
    };

    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={formIds.codigo} className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                id={formIds.codigo}
                name="codigo"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor={formIds.marca} className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                id={formIds.marca}
                name="marca"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="organization"
              />
            </div>
          </div>

          <div>
            <label htmlFor={formIds.nombre} className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id={formIds.nombre}
              name="nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={formIds.tipo} className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id={formIds.tipo}
                name="tipo"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="COLCHONES">Colchones</option>
                <option value="SOMMIERS">Sommiers</option>
                <option value="RESPALDOS">Respaldos</option>
                <option value="ALMOHADAS">Almohadas</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>
            <div>
              <label htmlFor={formIds.subtipo} className="block text-sm font-medium text-gray-700 mb-1">
                Subtipo
              </label>
              <input
                type="text"
                id={formIds.subtipo}
                name="subtipo"
                value={formData.subtipo}
                onChange={(e) =>
                  setFormData({ ...formData, subtipo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Viscoelástico, Resortes, etc."
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label htmlFor={formIds.medidas} className="block text-sm font-medium text-gray-700 mb-1">
              Medidas
            </label>
            <input
              type="text"
              id={formIds.medidas}
              name="medidas"
              value={formData.medidas}
              onChange={(e) =>
                setFormData({ ...formData, medidas: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2.00 x 1.40 x 0.25m"
              required
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={formIds.precioContado} className="block text-sm font-medium text-gray-700 mb-1">
                Precio Contado
              </label>
              <input
                type="number"
                id={formIds.precioContado}
                name="precioContado"
                value={formData.precioContado}
                onChange={(e) =>
                  setFormData({ ...formData, precioContado: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor={formIds.precioTarjeta} className="block text-sm font-medium text-gray-700 mb-1">
                Precio Tarjeta
              </label>
              <input
                type="number"
                id={formIds.precioTarjeta}
                name="precioTarjeta"
                value={formData.precioTarjeta}
                onChange={(e) =>
                  setFormData({ ...formData, precioTarjeta: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label htmlFor={formIds.image} className="block text-sm font-medium text-gray-700 mb-1">
              URL de Imagen
            </label>
            <input
              type="url"
              id={formIds.image}
              name="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
              autoComplete="url"
            />
          </div>

          <div>
            <label htmlFor={formIds.detalles} className="block text-sm font-medium text-gray-700 mb-1">
              Detalles
            </label>
            <textarea
              id={formIds.detalles}
              name="detalles"
              value={formData.detalles}
              onChange={(e) =>
                setFormData({ ...formData, detalles: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Componente StoreForm interno
  const StoreForm: React.FC = () => {
    const [formData, setFormData] = useState(storeData);

    // IDs únicos para este formulario
    const formIds = {
      name: generateId('store-name'),
      location: generateId('store-location'),
      phone: generateId('store-phone'),
      email: generateId('store-email'),
      hours: generateId('store-hours'),
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateStoreData(formData);
      onShowToast("¡Datos de la tienda actualizados correctamente!");

      setTimeout(() => {
        setSettingsView("main");
      }, 1000);
    };

    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={formIds.name} className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Tienda
            </label>
            <input
              type="text"
              id={formIds.name}
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="organization"
            />
          </div>

          <div>
            <label htmlFor={formIds.location} className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              id={formIds.location}
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="street-address"
            />
          </div>

          <div>
            <label htmlFor={formIds.phone} className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id={formIds.phone}
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor={formIds.email} className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id={formIds.email}
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor={formIds.hours} className="block text-sm font-medium text-gray-700 mb-1">
              Horarios
            </label>
            <input
              type="text"
              id={formIds.hours}
              name="hours"
              value={formData.hours}
              onChange={(e) =>
                setFormData({ ...formData, hours: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Lun-Vie 9:00-18:00"
              required
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Guardar Cambios
          </button>
        </form>
      </div>
    );
  };

  // Handlers para productos
  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    onSaveProduct(productData);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // IDs únicos para inputs de archivo
  const fileInputIds = {
    import: generateId('import-file'),
    importPrices: generateId('import-prices-file'),
  };

  // Función para renderizar el contenido según la vista
  const renderContent = () => {
    if (showProductForm) {
      return (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={handleCancelProductForm}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h3>
          </div>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelProductForm}
          />
        </div>
      );
    }

    switch (settingsView) {
      case "products":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettingsView("main")}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">
                  Gestión de Productos
                </h3>
              </div>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Agregar
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {product.nombre}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Código: {product.codigo}
                      </p>
                      <p className="text-xs text-gray-600">
                        Tipo: {product.tipo}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        Contado: ${formatPrice(product.precioContado)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditProductClick(product)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Editar producto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "store":
        return (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSettingsView("main")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold">Datos de la Tienda</h3>
            </div>
            <StoreForm />
          </div>
        );

      case "data":
        return (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSettingsView("main")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold">Gestión de Datos</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Exportar Datos
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Descarga una copia de seguridad de todos tus productos y
                  configuración.
                </p>
                <button
                  onClick={onExportData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  📥 Descargar Backup
                </button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  Importar Datos
                </h4>
                <p className="text-sm text-green-700 mb-3">
                  Restaura datos desde un archivo de backup.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                  id={fileInputIds.import}
                />
                <label
                  htmlFor={fileInputIds.import}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors cursor-pointer inline-block"
                >
                  📤 Subir Backup
                </label>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">
                  Restablecer Datos
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  Volver a los datos por defecto. Esta acción no se puede
                  deshacer.
                </p>
                <button
                  onClick={onResetData}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  🔄 Restablecer
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Estado Actual
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Productos:</span>
                    <span className="ml-2 font-medium">
                      {products.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Usuario:</span>
                    <span className="ml-2 font-medium">
                      {currentUser?.username}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "prices":
        return (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSettingsView("main")}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold">
                Actualizar Precios
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">
                  Importar Lista de Precios
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Selecciona un archivo CSV con la lista mayorista (código,
                  nombre, medida, precio, estado) para actualizar los
                  productos existentes. Si tu proveedor envía la lista en
                  formato Excel, conviértela primero a CSV.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={onImportPriceList}
                  className="hidden"
                  id={fileInputIds.importPrices}
                />
                <label
                  htmlFor={fileInputIds.importPrices}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors cursor-pointer inline-block"
                >
                  💲 Importar Precios
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Configuración
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setSettingsView("products")}
                className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Gestión de Productos
                    </h3>
                    <p className="text-sm text-gray-600">
                      Agregar, editar y eliminar productos
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSettingsView("store")}
                className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Datos de la Tienda
                    </h3>
                    <p className="text-sm text-gray-600">
                      Nombre, ubicación, contacto
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSettingsView("data")}
                className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Gestión de Datos
                    </h3>
                    <p className="text-sm text-gray-600">
                      Backup, importar, exportar
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSettingsView("prices")}
                className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Actualizar Precios
                    </h3>
                    <p className="text-sm text-gray-600">
                      Importar lista desde CSV
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium text-gray-900 mb-3">
                Información Actual
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Usuario:</strong> {currentUser?.username}
                </p>
                <p>
                  <strong>Tienda:</strong> {storeData.name}
                </p>
                <p>
                  <strong>Ubicación:</strong> {storeData.location}
                </p>
                <p>
                  <strong>Teléfono:</strong> {storeData.phone}
                </p>
                <p>
                  <strong>Email:</strong> {storeData.email}
                </p>
                <p>
                  <strong>Productos:</strong> {products.length} items
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setSettingsView("main");
    setShowProductForm(false);
    setEditingProduct(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsModal;