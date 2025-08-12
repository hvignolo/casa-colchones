// Sistema de almacenamiento offline usando IndexedDB y localStorage
import { Product, StoreData, User } from './types';

// Configuración de IndexedDB
const DB_NAME = 'CasaColchonesDB';
const DB_VERSION = 1;
const STORES = {
  PRODUCTS: 'products',
  STORE_DATA: 'storeData',
  USERS: 'users',
  SYNC_QUEUE: 'syncQueue',
  OFFLINE_ACTIONS: 'offlineActions'
};

class OfflineStorage {
  private db: IDBDatabase | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.initDB();
    this.setupOnlineDetection();
  }

  // Inicializar IndexedDB
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para productos
        if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
          const productsStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
          productsStore.createIndex('codigo', 'codigo', { unique: true });
          productsStore.createIndex('tipo', 'tipo', { unique: false });
        }

        // Store para datos de la tienda
        if (!db.objectStoreNames.contains(STORES.STORE_DATA)) {
          db.createObjectStore(STORES.STORE_DATA, { keyPath: 'userId' });
        }

        // Store para usuarios
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          db.createObjectStore(STORES.USERS, { keyPath: 'username' });
        }

        // Store para cola de sincronización
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para acciones offline
        if (!db.objectStoreNames.contains(STORES.OFFLINE_ACTIONS)) {
          const actionsStore = db.createObjectStore(STORES.OFFLINE_ACTIONS, { keyPath: 'id', autoIncrement: true });
          actionsStore.createIndex('userId', 'userId', { unique: false });
        }
      };
    });
  }

  // Configurar detección de conexión online/offline
  private setupOnlineDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
      this.notifyConnectionChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyConnectionChange(false);
    });
  }

  // Notificar cambios de conexión
  private notifyConnectionChange(isOnline: boolean): void {
    const event = new CustomEvent('connectionchange', { detail: { isOnline } });
    window.dispatchEvent(event);
  }

  // ==================== PRODUCTOS ====================

  // Guardar productos en IndexedDB
  async saveProducts(products: Product[], userId: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.PRODUCTS], 'readwrite');
    const store = transaction.objectStore(STORES.PRODUCTS);

    // Agregar userId a cada producto para identificación
    const productsWithUser = products.map(p => ({ ...p, userId }));

    for (const product of productsWithUser) {
      await new Promise<void>((resolve, reject) => {
        const request = store.put(product);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  // Obtener productos desde IndexedDB
  async getProducts(userId: string): Promise<Product[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.PRODUCTS], 'readonly');
      const store = transaction.objectStore(STORES.PRODUCTS);
      const request = store.getAll();

      request.onsuccess = () => {
        const allProducts = request.result;
        // Filtrar productos del usuario actual
        const userProducts = allProducts
          .filter((p: any) => p.userId === userId)
          .map((p: any) => {
            const { userId: _, ...product } = p;
            return product;
          });
        resolve(userProducts);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // ==================== DATOS DE TIENDA ====================

  // Guardar datos de la tienda
  async saveStoreData(storeData: StoreData, userId: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.STORE_DATA], 'readwrite');
    const store = transaction.objectStore(STORES.STORE_DATA);

    return new Promise<void>((resolve, reject) => {
      const request = store.put({ ...storeData, userId });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Obtener datos de la tienda
  async getStoreData(userId: string): Promise<StoreData | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.STORE_DATA], 'readonly');
      const store = transaction.objectStore(STORES.STORE_DATA);
      const request = store.get(userId);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { userId: _, ...storeData } = result;
          resolve(storeData as StoreData);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // ==================== USUARIOS ====================

  // Guardar usuario
  async saveUser(user: User): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.USERS], 'readwrite');
    const store = transaction.objectStore(STORES.USERS);

    return new Promise<void>((resolve, reject) => {
      const request = store.put(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Obtener usuario
  async getUser(username: string): Promise<User | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.USERS], 'readonly');
      const store = transaction.objectStore(STORES.USERS);
      const request = store.get(username);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<Record<string, User>> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.USERS], 'readonly');
      const store = transaction.objectStore(STORES.USERS);
      const request = store.getAll();

      request.onsuccess = () => {
        const users: Record<string, User> = {};
        request.result.forEach((user: User) => {
          users[user.username] = user;
        });
        resolve(users);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // ==================== ACCIONES OFFLINE ====================

  // Registrar acción realizada offline
  async addOfflineAction(action: any, userId: string): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.OFFLINE_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.OFFLINE_ACTIONS);

    const offlineAction = {
      ...action,
      userId,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise<void>((resolve, reject) => {
      const request = store.add(offlineAction);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Obtener acciones offline pendientes
  async getPendingActions(userId: string): Promise<any[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.OFFLINE_ACTIONS], 'readonly');
      const store = transaction.objectStore(STORES.OFFLINE_ACTIONS);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const actions = request.result.filter((action: any) => !action.synced);
        resolve(actions);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Marcar acción como sincronizada
  async markActionAsSynced(actionId: number): Promise<void> {
    if (!this.db) await this.initDB();
    
    const transaction = this.db!.transaction([STORES.OFFLINE_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.OFFLINE_ACTIONS);

    return new Promise<void>((resolve, reject) => {
      const getRequest = store.get(actionId);
      
      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          action.synced = true;
          const putRequest = store.put(action);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // ==================== SINCRONIZACIÓN ====================

  // Sincronizar datos cuando vuelva la conexión
  async syncOfflineData(): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Aquí puedes implementar la lógica de sincronización con el servidor
      console.log('Sincronizando datos offline...');
      
      // Por ahora, como tu app es completamente offline, 
      // esta función puede estar vacía o registrar las acciones
      
      const event = new CustomEvent('syncComplete');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error durante la sincronización:', error);
    }
  }

  // ==================== ESTADO DE CONEXIÓN ====================

  // Verificar si está online
  isOnlineStatus(): boolean {
    return this.isOnline;
  }

  // ==================== FALLBACK A LOCALSTORAGE ====================

  // Fallback para localStorage si IndexedDB no está disponible
  private fallbackSave(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private fallbackLoad(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  // ==================== LIMPIEZA ====================

  // Limpiar datos antiguos
  async cleanOldData(daysOld: number = 30): Promise<void> {
    if (!this.db) await this.initDB();
    
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    // Limpiar acciones offline antiguas ya sincronizadas
    const transaction = this.db!.transaction([STORES.OFFLINE_ACTIONS], 'readwrite');
    const store = transaction.objectStore(STORES.OFFLINE_ACTIONS);
    const index = store.index('timestamp');
    
    const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const action = cursor.value;
        if (action.synced) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
  }
}

// Instancia singleton
export const offlineStorage = new OfflineStorage();
export default offlineStorage;