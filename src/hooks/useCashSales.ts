import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    orderBy,
    where
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { CashSale } from '../types';

export const useCashSales = () => {
    const [sales, setSales] = useState<CashSale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        // Get sales ordered by date descending
        const q = query(
            collection(db, 'cash_sales'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const salesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as CashSale[];

                setSales(salesData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching cash sales:", err);
                setError("Error al cargar las ventas al contado.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addCashSale = async (sale: Omit<CashSale, 'id' | 'createdAt'>) => {
        try {
            const newSale = {
                ...sale,
                createdAt: new Date().toISOString(),
            };
            await addDoc(collection(db, 'cash_sales'), newSale);
        } catch (err) {
            console.error("Error adding cash sale:", err);
            throw new Error("No se pudo registrar la venta.");
        }
    };

    return {
        sales,
        loading,
        error,
        addCashSale
    };
};
