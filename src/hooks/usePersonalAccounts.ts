
import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    Timestamp,
    getDocs,
    where
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PersonalAccount } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const usePersonalAccounts = () => {
    const [accounts, setAccounts] = useState<PersonalAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Assuming we might scope by user later, or just access check

    useEffect(() => {
        setLoading(true);
        // Construct query to get accounts ordered by creation date
        const q = query(
            collection(db, 'personal_accounts'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const accountsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as PersonalAccount[];

                setAccounts(accountsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching personal accounts:", err);
                setError("Error al cargar las cuentas corrientes.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addAccount = async (account: Omit<PersonalAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const newAccount = {
                ...account,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Default status if not provided, though type requires it. 
                // We'll trust the input respects the type.
            };
            const docRef = await addDoc(collection(db, 'personal_accounts'), newAccount);
            return docRef.id;
        } catch (err) {
            console.error("Error adding account:", err);
            throw new Error("No se pudo crear la cuenta.");
        }
    };

    const updateAccount = async (id: string, updates: Partial<PersonalAccount>) => {
        try {
            const accountRef = doc(db, 'personal_accounts', id);
            await updateDoc(accountRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Error updating account:", err);
            throw new Error("No se pudo actualizar la cuenta.");
        }
    };

    const deleteAccount = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'personal_accounts', id));
        } catch (err) {
            console.error("Error deleting account:", err);
            throw new Error("No se pudo eliminar la cuenta.");
        }
    };

    // Helper to register a payment
    const registerPayment = async (account: PersonalAccount) => {
        if (account.paidInstallments >= account.totalInstallments) {
            throw new Error("La cuenta ya está pagada completamente.");
        }

        const newPaid = account.paidInstallments + 1;
        const isCompleted = newPaid >= account.totalInstallments;

        await updateAccount(account.id!, {
            paidInstallments: newPaid,
            lastPaymentDate: new Date().toISOString(),
            status: isCompleted ? 'completed' : account.status
        });
    };

    return {
        accounts,
        loading,
        error,
        addAccount,
        updateAccount,
        deleteAccount,
        registerPayment
    };
};
