import { useState, useEffect, useCallback, useRef } from 'react';
import { Product, StoreData, User } from './types';
import offlineStorage from './offlineStorage';

interface UseOfflineReturn {
  isOnline: boolean;
  isLoading: boolean;
  saveProductsOffline: (products: Product[], userId: string) => Promise<void>;
  loadProductsOffline: (userId: string) => Promise<Product[]>;
  saveStoreDataOffline: (storeData: StoreData, userId: string) => Promise<void>;
  loadStoreDataOffline: (userId: string) => Promise<StoreData | null>;
  saveUserOffline: (user: User) => Promise<void>;
  loadUserOffline: (username: string) => Promise<User | null>;
  loadAllUsersOffline: () => Promise<Record<string, User>>;
  addOfflineAction: (action: any, userId: string) => Promise<void>;
  syncPendingActions: (userId: string) => Promise<void>;
  clearOldData: () => Promise<void>;
}

export const useOffline = (): UseOfflineReturn => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Usar useRef para evitar múltiples operaciones simultáneas
  const operationInProgress = useRef(false);

  // Detectar cambios en el estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleConnectionChange = (event: CustomEvent) => {
      setIsOnline(event.detail.isOnline);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('connectionchange', handleConnectionChange as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('connectionchange', handleConnectionChange as EventListener);
    };
  }, []);

  // Guardar productos offline - SIN setIsLoading para evitar parpadeo
  const saveProductsOffline = useCallback(async (products: Product[], userId: string): Promise<void> => {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    
    try {
      await offlineStorage.saveProducts(products, userId);
      
      // También guardar en localStorage como fallback
      const fallbackKey = `user_${userId}_products`;
      localStorage.setItem(fallbackKey, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products offline:', error);
      // Fallback a localStorage
      const fallbackKey = `user_${userId}_products`;
      localStorage.setItem(fallbackKey, JSON.stringify(products));
    } finally {
      operationInProgress.current = false;
    }
  }, []);

  // Cargar productos offline - Solo mostrar loading en la carga inicial
  const loadProductsOffline = useCallback(async (userId: string): Promise<Product[]> => {
    // Solo mostrar loading si es la primera carga
    const isFirstLoad = !localStorage.getItem(`user_${userId}_products_loaded`);
    
    if (isFirstLoad) {
      setIsLoading(true);
    }
    
    try {
      const products = await offlineStorage.getProducts(userId);
      
      // Marcar como cargado
      localStorage.setItem(`user_${userId}_products_loaded`, 'true');
      
      return products;
    } catch (error) {
      console.error('Error loading products offline:', error);
      // Fallback a localStorage
      const fallbackKey = `user_${userId}_products`;
      const fallbackData = localStorage.getItem(fallbackKey);
      return fallbackData ? JSON.parse(fallbackData) : [];
    } finally {
      if (isFirstLoad) {
        setIsLoading(false);
      }
    }
  }, []);

  // Guardar datos de tienda offline - SIN setIsLoading
  const saveStoreDataOffline = useCallback(async (storeData: StoreData, userId: string): Promise<void> => {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    
    try {
      await offlineStorage.saveStoreData(storeData, userId);
      
      // También guardar en localStorage como fallback
      const fallbackKey = `user_${userId}_storeData`;
      localStorage.setItem(fallbackKey, JSON.stringify(storeData));
    } catch (error) {
      console.error('Error saving store data offline:', error);
      // Fallback a localStorage
      const fallbackKey = `user_${userId}_storeData`;
      localStorage.setItem(fallbackKey, JSON.stringify(storeData));
    } finally {
      operationInProgress.current = false;
    }
  }, []);

  // Cargar datos de tienda offline - Solo loading en primera carga
  const loadStoreDataOffline = useCallback(async (userId: string): Promise<StoreData | null> => {
    const isFirstLoad = !localStorage.getItem(`user_${userId}_storeData_loaded`);
    
    if (isFirstLoad) {
      setIsLoading(true);
    }
    
    try {
      const storeData = await offlineStorage.getStoreData(userId);
      
      // Marcar como cargado
      localStorage.setItem(`user_${userId}_storeData_loaded`, 'true');
      
      return storeData;
    } catch (error) {
      console.error('Error loading store data offline:', error);
      // Fallback a localStorage
      const fallbackKey = `user_${userId}_storeData`;
      const fallbackData = localStorage.getItem(fallbackKey);
      return fallbackData ? JSON.parse(fallbackData) : null;
    } finally {
      if (isFirstLoad) {
        setIsLoading(false);
      }
    }
  }, []);

  // Guardar usuario offline - SIN setIsLoading
  const saveUserOffline = useCallback(async (user: User): Promise<void> => {
    try {
      await offlineStorage.saveUser(user);
      
      // También actualizar en localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '{}');
      users[user.username] = user;
      localStorage.setItem('app_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user offline:', error);
      // Fallback a localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '{}');
      users[user.username] = user;
      localStorage.setItem('app_users', JSON.stringify(users));
    }
  }, []);

  // Cargar usuario offline - SIN setIsLoading
  const loadUserOffline = useCallback(async (username: string): Promise<User | null> => {
    try {
      const user = await offlineStorage.getUser(username);
      return user;
    } catch (error) {
      console.error('Error loading user offline:', error);
      // Fallback a localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '{}');
      return users[username] || null;
    }
  }, []);

  // Cargar todos los usuarios offline - SIN setIsLoading
  const loadAllUsersOffline = useCallback(async (): Promise<Record<string, User>> => {
    try {
      const users = await offlineStorage.getAllUsers();
      return users;
    } catch (error) {
      console.error('Error loading all users offline:', error);
      // Fallback a localStorage
      return JSON.parse(localStorage.getItem('app_users') || '{}');
    }
  }, []);

  // Agregar acción offline para sincronizar después
  const addOfflineAction = useCallback(async (action: any, userId: string): Promise<void> => {
    if (isOnline) return; // Solo guardar acciones si está offline

    try {
      await offlineStorage.addOfflineAction(action, userId);
    } catch (error) {
      console.error('Error adding offline action:', error);
      // Fallback a localStorage
      const actionsKey = `offline_actions_${userId}`;
      const existingActions = JSON.parse(localStorage.getItem(actionsKey) || '[]');
      existingActions.push({
        ...action,
        timestamp: Date.now(),
        synced: false
      });
      localStorage.setItem(actionsKey, JSON.stringify(existingActions));
    }
  }, [isOnline]);

  // Sincronizar acciones pendientes
  const syncPendingActions = useCallback(async (userId: string): Promise<void> => {
    if (!isOnline) return;

    try {
      const pendingActions = await offlineStorage.getPendingActions(userId);
      
      // Procesar cada acción pendiente
      for (const action of pendingActions) {
        try {
          // Aquí puedes implementar la lógica específica para cada tipo de acción
          console.log('Procesando acción offline:', action);
          
          // Marcar como sincronizada
          await offlineStorage.markActionAsSynced(action.id);
        } catch (error) {
          console.error('Error syncing action:', error);
        }
      }

      // Disparar evento de sincronización completa
      const syncEvent = new CustomEvent('syncComplete', {
        detail: { actionsProcessed: pendingActions.length }
      });
      window.dispatchEvent(syncEvent);

    } catch (error) {
      console.error('Error syncing pending actions:', error);
    }
  }, [isOnline]);

  // Limpiar datos antiguos
  const clearOldData = useCallback(async (): Promise<void> => {
    try {
      await offlineStorage.cleanOldData(30); // Limpiar datos de más de 30 días
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }, []);

  // Sincronizar automáticamente cuando se conecte (sin causar re-renders)
  useEffect(() => {
    if (isOnline) {
      // Obtener usuario actual para sincronizar
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        // Usar setTimeout para evitar problemas de sincronización
        const timeoutId = setTimeout(() => {
          syncPendingActions(currentUser.username);
        }, 1000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isOnline, syncPendingActions]);

  return {
    isOnline,
    isLoading,
    saveProductsOffline,
    loadProductsOffline,
    saveStoreDataOffline,
    loadStoreDataOffline,
    saveUserOffline,
    loadUserOffline,
    loadAllUsersOffline,
    addOfflineAction,
    syncPendingActions,
    clearOldData
  };
};