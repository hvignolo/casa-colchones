import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { StoreData } from '../types';
import { DEFAULT_STORE_DATA } from '../constants';

interface StoreContextType {
    storeData: StoreData;
    loading: boolean;
    updateStoreData: (data: StoreData) => Promise<void>;
    refreshStoreData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [storeData, setStoreData] = useState<StoreData>(DEFAULT_STORE_DATA);
    const [loading, setLoading] = useState(true);

    // Reference to the single store configuration document
    const storeDocRef = doc(db, 'settings', 'store_config');

    useEffect(() => {
        // Listen for real-time updates
        const unsubscribe = onSnapshot(storeDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setStoreData(docSnap.data() as StoreData);
            } else {
                // If document doesn't exist, we might want to create it or just stick with defaults
                console.log("No store config found in Firestore, using defaults.");
                // Optional: Create it if it doesn't exist? 
                // For now, we just stick to defaults until saved.
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching store data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStoreData = async (data: StoreData) => {
        try {
            await setDoc(storeDocRef, data);
            // Local state update is handled by the onSnapshot listener, 
            // but we can optimistic update if needed. 
        } catch (error) {
            console.error("Error updating store data:", error);
            throw error;
        }
    };

    const refreshStoreData = async () => {
        // Manual refresh if needed (though snapshot handles it)
        const docSnap = await getDoc(storeDocRef);
        if (docSnap.exists()) {
            setStoreData(docSnap.data() as StoreData);
        }
    }

    return (
        <StoreContext.Provider value={{ storeData, loading, updateStoreData, refreshStoreData }}>
            {children}
        </StoreContext.Provider>
    );
};
