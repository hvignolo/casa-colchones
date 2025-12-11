import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, setDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { Product } from '../types';
import { defaultProducts } from '../defaultProducts';

interface ProductContextType {
    products: Product[];
    loading: boolean;
    updateProduct: (product: Product) => Promise<void>;
    updateProductsBatch: (products: Product[]) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Load initial data from defaultProducts if Firestore is empty (handled by logic below) or just listen
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
            if (snapshot.empty) {
                // Optional: Auto-seed if empty? For now, we'll rely on Admin to seed or just show defaults locally
                // But to be consistent with "Global Persistence", we should probably show what's in DB.
                // If DB is empty, we arguably show nothing or defaults.
                // Let's settle on: If empty, show defaults locally but don't write them yet unless triggered.
                setProducts(defaultProducts);
            } else {
                const productList: Product[] = [];
                snapshot.forEach((doc) => {
                    productList.push(doc.data() as Product);
                });
                // Sort by ID to keep order stable
                productList.sort((a, b) => a.id - b.id);
                setProducts(productList);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products from Firestore:", error);
            // Fallback to local defaults on error
            setProducts(defaultProducts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateProduct = async (product: Product) => {
        try {
            // Use string ID for doc reference, but keep numeric ID in data
            await setDoc(doc(db, "products", product.codigo), product);
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    };

    const updateProductsBatch = async (newProducts: Product[]) => {
        const BATCH_SIZE = 500;
        const chunks = [];

        for (let i = 0; i < newProducts.length; i += BATCH_SIZE) {
            chunks.push(newProducts.slice(i, i + BATCH_SIZE));
        }

        try {
            await Promise.all(chunks.map(async (chunk) => {
                const batch = writeBatch(db);
                chunk.forEach((product) => {
                    const productRef = doc(db, "products", product.codigo);
                    batch.set(productRef, product);
                });
                await batch.commit();
            }));
        } catch (error) {
            console.error("Error batch updating products:", error);
            throw error;
        }
    };

    const deleteProduct = async (productId: string) => {
        try {
            await deleteDoc(doc(db, "products", productId));
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    };

    return (
        <ProductContext.Provider value={{ products, loading, updateProduct, updateProductsBatch, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
