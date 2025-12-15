import React, { useState, useMemo, useEffect } from "react";
import { X, Save, Search, Filter, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { Product } from "../../types";

interface StockManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onUpdateProducts: (products: Product[]) => Promise<void>;
}

export const StockManagementModal: React.FC<StockManagementModalProps> = ({
    isOpen,
    onClose,
    products,
    onUpdateProducts,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [editedProducts, setEditedProducts] = useState<Map<string, { stock: number; minStock: number }>>(new Map());
    const [isSaving, setIsSaving] = useState(false);

    // Reset local state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setEditedProducts(new Map());
            setSearchQuery("");
            setShowLowStockOnly(false);
        }
    }, [isOpen]);

    const filteredProducts = useMemo(() => {
        let result = products;

        if (showLowStockOnly) {
            result = result.filter((p) => {
                const currentStock = editedProducts.get(p.codigo)?.stock ?? p.stock ?? 0;
                const currentMinStock = editedProducts.get(p.codigo)?.minStock ?? p.minStock ?? 0;
                // Show if stock is 0 OR less than equal to minStock (if minStock is set)
                // If minStock is 0, we only consider it low if stock is 0.
                // Let's adopt logic: Low if Stock <= MinStock (and MinStock > 0) OR Stock == 0
                if (currentMinStock > 0) {
                    return currentStock <= currentMinStock;
                }
                return currentStock === 0;
            });
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(query) ||
                    p.codigo.toLowerCase().includes(query) ||
                    p.marca.toLowerCase().includes(query)
            );
        }

        return result;
    }, [products, searchQuery, showLowStockOnly, editedProducts]);

    const handleStockChange = (codigo: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedProducts((prev) => {
            const newMap = new Map(prev);
            const existing = newMap.get(codigo) || {
                stock: products.find(p => p.codigo === codigo)?.stock ?? 0,
                minStock: products.find(p => p.codigo === codigo)?.minStock ?? 0
            };
            newMap.set(codigo, { ...existing, stock: numValue });
            return newMap;
        });
    };

    const handleMinStockChange = (codigo: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedProducts((prev) => {
            const newMap = new Map(prev);
            const existing = newMap.get(codigo) || {
                stock: products.find(p => p.codigo === codigo)?.stock ?? 0,
                minStock: products.find(p => p.codigo === codigo)?.minStock ?? 0
            };
            newMap.set(codigo, { ...existing, minStock: numValue });
            return newMap;
        });
    };

    const handleSave = async () => {
        if (editedProducts.size === 0) {
            onClose();
            return;
        }

        setIsSaving(true);
        try {
            const productsToUpdate: Product[] = [];

            editedProducts.forEach((changes, codigo) => {
                const originalProduct = products.find(p => p.codigo === codigo);
                if (originalProduct) {
                    productsToUpdate.push({
                        ...originalProduct,
                        stock: changes.stock,
                        minStock: changes.minStock
                    });
                }
            });

            await onUpdateProducts(productsToUpdate);
            onClose();
        } catch (error) {
            console.error("Error updating stock:", error);
            // Here you might want to show an error toast if passed from parent or handle locally
            alert("Error al actualizar el stock. Intente nuevamente.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Gestión de Stock</h2>
                            <p className="text-sm text-gray-500">Administra cantidades y alertas de stock bajo</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, código o marca..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${showLowStockOnly
                                ? "bg-amber-50 border-amber-200 text-amber-700 font-medium"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Stock Bajo
                    </button>
                </div>

                {/* Content - Scrollable Table */}
                <div className="flex-1 overflow-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Código</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32 text-center">Stock Actual</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32 text-center">Stock Mínimo</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => {
                                const currentStock = editedProducts.get(product.codigo)?.stock ?? product.stock ?? 0;
                                const currentMinStock = editedProducts.get(product.codigo)?.minStock ?? product.minStock ?? 0;

                                let statusColor = "text-green-500 bg-green-50";
                                let statusIcon = <CheckCircle className="w-4 h-4" />;

                                if (currentStock === 0) {
                                    statusColor = "text-red-500 bg-red-50";
                                    statusIcon = <AlertTriangle className="w-4 h-4" />;
                                } else if (currentMinStock > 0 && currentStock <= currentMinStock) {
                                    statusColor = "text-amber-500 bg-amber-50";
                                    statusIcon = <AlertTriangle className="w-4 h-4" />;
                                }

                                return (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-500 font-mono">{product.codigo}</td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                            <div className="text-xs text-gray-500">{product.marca} - {product.subtipo}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={currentStock}
                                                    onChange={(e) => handleStockChange(product.codigo, e.target.value)}
                                                    className="w-20 px-2 py-1 text-center border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={currentMinStock}
                                                    onChange={(e) => handleMinStockChange(product.codigo, e.target.value)}
                                                    className="w-20 px-2 py-1 text-center border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className={`inline-flex items-center justify-center p-1.5 rounded-full ${statusColor}`}>
                                                {statusIcon}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No se encontraron productos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {editedProducts.size > 0
                            ? `${editedProducts.size} producto${editedProducts.size !== 1 ? 's' : ''} modificado${editedProducts.size !== 1 ? 's' : ''}`
                            : "Sin cambios pendientes"
                        }
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || editedProducts.size === 0}
                            className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all ${(isSaving || editedProducts.size === 0) ? "opacity-50 cursor-not-allowed" : "hover:shadow-md transform hover:-translate-y-0.5"
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
