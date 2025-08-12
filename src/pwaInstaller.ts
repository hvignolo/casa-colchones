// Instalador de PWA y gestor de funcionalidades offline
export class PWAInstaller {
  private deferredPrompt: any = null;
  private isInstalled = false;
  private installButton: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Detectar si ya está instalado
    this.checkIfInstalled();
    
    // Configurar listeners
    this.setupEventListeners();
    
    // Registrar Service Worker con manejo mejorado de errores
    await this.registerServiceWorker();
  }

  /**
   * Verifica si la PWA ya está instalada
   */
  private checkIfInstalled() {
    // Detectar si está en modo standalone (instalado)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('PWA is installed and running in standalone mode');
      return;
    }

    // Detectar otros indicadores de instalación
    if ((window as any).navigator.standalone === true) {
      this.isInstalled = true;
      console.log('PWA is installed on iOS');
      return;
    }

    // Verificar si viene de una instalación
    if (document.referrer.includes('android-app://')) {
      this.isInstalled = true;
      console.log('PWA is installed on Android');
      return;
    }
  }

  /**
   * Configura los event listeners para PWA
   */
  private setupEventListeners() {
    // Listener para el evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt fired');
      // Prevenir que el browser muestre el prompt automáticamente
      e.preventDefault();
      // Guardar el evento para usarlo después
      this.deferredPrompt = e;
      // Mostrar el botón de instalación personalizado
      this.showInstallButton();
    });

    // Listener para cuando la app se instala
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showInstallationSuccess();
    });

    // Listener para cambios en el modo display
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      if (e.matches) {
        console.log('App is now running in standalone mode');
        this.isInstalled = true;
      }
    });
  }

  /**
   * Registra el Service Worker con manejo mejorado de errores
   */
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      // Registrar con scope correcto
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Forzar verificación de actualizaciones
      });

      console.log('Service Worker registered successfully:', registration);

      // Verificar si hay un SW en espera
      if (registration.waiting) {
        this.showUpdateAvailable();
      }

      // Manejar actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('New Service Worker found, installing...');
          
          newWorker.addEventListener('statechange', () => {
            console.log('Service Worker state changed:', newWorker.state);
            
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                console.log('New content is available; please refresh.');
                this.showUpdateAvailable();
              } else {
                // Primera instalación
                console.log('Content is cached for offline use.');
              }
            }

            if (newWorker.state === 'activated') {
              console.log('Service Worker activated');
            }
          });
        }
      });

      // Escuchar mensajes del Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event.data);
      });

      // Verificar actualizaciones periódicamente
      setInterval(() => {
        registration.update();
      }, 60000); // Cada minuto

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      
      // Diagnóstico de errores comunes
      if (error instanceof TypeError) {
        console.error('Possible causes:');
        console.error('- Service Worker file not found or incorrect MIME type');
        console.error('- Network issues preventing SW download');
        console.error('- CORS issues with SW file');
      }
      
      // Continuar sin Service Worker
      console.log('App will work without offline capabilities');
    }
  }

  /**
   * Muestra el botón de instalación
   */
  private showInstallButton() {
    // Crear botón si no existe
    if (!this.installButton) {
      this.createInstallButton();
    }
    
    if (this.installButton) {
      this.installButton.style.display = 'flex';
    }

    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('pwaInstallAvailable'));
  }

  /**
   * Oculta el botón de instalación
   */
  private hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
  }

  /**
   * Crea el botón de instalación
   */
  private createInstallButton() {
    this.installButton = document.createElement('button');
    this.installButton.innerHTML = `
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
      </svg>
      Instalar App
    `;
    this.installButton.className = `
      fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg 
      shadow-lg hover:bg-blue-700 transition-colors flex items-center z-50
      font-medium text-sm
    `.trim();
    this.installButton.style.display = 'none';
    
    this.installButton.addEventListener('click', () => {
      this.installPWA();
    });

    document.body.appendChild(this.installButton);
  }

  /**
   * Instala la PWA
   */
  public async installPWA(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      // Mostrar el prompt de instalación
      this.deferredPrompt.prompt();
      
      // Esperar la respuesta del usuario
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.hideInstallButton();
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during installation:', error);
      return false;
    } finally {
      // Limpiar el prompt diferido
      this.deferredPrompt = null;
    }
  }

  /**
   * Muestra mensaje de instalación exitosa
   */
  private showInstallationSuccess() {
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
      <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm font-medium">¡App instalada exitosamente!</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  }

  /**
   * Muestra notificación de actualización disponible
   */
  private showUpdateAvailable() {
    const updateMessage = document.createElement('div');
    updateMessage.innerHTML = `
      <div class="fixed top-4 left-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 mx-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span class="text-sm font-medium">Nueva versión disponible</span>
          </div>
          <button id="updateBtn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 ml-4">
            Actualizar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(updateMessage);
    
    // Manejar click en actualizar
    const updateBtn = document.getElementById('updateBtn');
    updateBtn?.addEventListener('click', () => {
      this.updateApp();
      document.body.removeChild(updateMessage);
    });

    // Remover después de 10 segundos si no se hace click
    setTimeout(() => {
      if (document.body.contains(updateMessage)) {
        document.body.removeChild(updateMessage);
      }
    }, 10000);
  }

  /**
   * Actualiza la aplicación
   */
  private async updateApp() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          // Enviar mensaje al SW para que se active
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Escuchar cuando el nuevo SW tome control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            // Recargar la página para usar la nueva versión
            window.location.reload();
          });
        } else {
          // Forzar actualización
          await registration?.update();
          window.location.reload();
        }
      } catch (error) {
        console.error('Error updating app:', error);
        // Fallback: simplemente recargar
        window.location.reload();
      }
    }
  }

  /**
   * Maneja mensajes del Service Worker
   */
  private handleServiceWorkerMessage(data: any) {
    switch (data.type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated');
        break;
      case 'OFFLINE_MODE':
        this.showOfflineMessage();
        break;
      case 'ONLINE_MODE':
        this.showOnlineMessage();
        break;
      case 'SYNC_COMPLETE':
        console.log('Background sync completed');
        // Mostrar notificación de sincronización
        this.showSyncComplete();
        break;
      default:
        console.log('SW message:', data);
    }
  }

  /**
   * Muestra mensaje de sincronización completada
   */
  private showSyncComplete() {
    const syncMessage = document.createElement('div');
    syncMessage.innerHTML = `
      <div class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div class="flex items-center text-sm">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          Datos sincronizados
        </div>
      </div>
    `;
    
    document.body.appendChild(syncMessage);
    
    setTimeout(() => {
      if (document.body.contains(syncMessage)) {
        document.body.removeChild(syncMessage);
      }
    }, 2000);
  }

  /**
   * Muestra mensaje de modo offline
   */
  private showOfflineMessage() {
    window.dispatchEvent(new CustomEvent('connectionchange', {
      detail: { isOnline: false }
    }));
  }

  /**
   * Muestra mensaje de modo online
   */
  private showOnlineMessage() {
    window.dispatchEvent(new CustomEvent('connectionchange', {
      detail: { isOnline: true }
    }));
  }

  /**
   * Verifica si la PWA puede ser instalada
   */
  public canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled;
  }

  /**
   * Verifica si la PWA está instalada
   */
  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Obtiene información sobre las capacidades de la PWA
   */
  public getPWAInfo() {
    return {
      isInstalled: this.isInstalled,
      canInstall: this.canInstall(),
      hasServiceWorker: 'serviceWorker' in navigator,
      isOnline: navigator.onLine,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      platform: this.detectPlatform(),
      swRegistered: navigator.serviceWorker.controller !== null
    };
  }

  /**
   * Detecta la plataforma del usuario
   */
  private detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/android/.test(userAgent)) {
      return 'Android';
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'iOS';
    } else if (/windows/.test(userAgent)) {
      return 'Windows';
    } else if (/mac/.test(userAgent)) {
      return 'macOS';
    } else if (/linux/.test(userAgent)) {
      return 'Linux';
    }
    
    return 'Unknown';
  }

  /**
   * Comparte contenido usando la Web Share API si está disponible
   */
  public async shareContent(data: ShareData): Promise<boolean> {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    } else {
      // Fallback: copiar al clipboard o abrir en nueva ventana
      this.fallbackShare(data);
      return false;
    }
  }

  /**
   * Fallback para compartir cuando Web Share API no está disponible
   */
  private fallbackShare(data: ShareData) {
    const text = `${data.title || ''}\n${data.text || ''}\n${data.url || ''}`;
    
    if ('clipboard' in navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        console.log('Content copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        this.manualCopyFallback(text);
      });
    } else {
      this.manualCopyFallback(text);
    }
  }

  /**
   * Fallback manual para copiar texto
   */
  private manualCopyFallback(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      console.log('Content copied using execCommand');
    } catch (err) {
      console.error('Failed to copy using execCommand:', err);
    }
    
    document.body.removeChild(textArea);
  }

  /**
   * Fuerza la actualización del Service Worker
   */
  public async forceUpdate(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('Service Worker update forced');
        }
      } catch (error) {
        console.error('Error forcing SW update:', error);
      }
    }
  }

  /**
   * Limpia recursos
   */
  public destroy() {
    if (this.installButton && document.body.contains(this.installButton)) {
      document.body.removeChild(this.installButton);
      this.installButton = null;
    }
  }
}

// Instancia global del instalador PWA
export const pwaInstaller = new PWAInstaller();

// Función para inicializar PWA en tu app
export const initializePWA = () => {
  console.log('Initializing PWA...');
  const pwaInfo = pwaInstaller.getPWAInfo();
  console.log('PWA Info:', pwaInfo);
  
  // Escuchar eventos personalizados
  window.addEventListener('pwaInstallAvailable', () => {
    console.log('PWA install is now available');
  });
  
  return pwaInstaller;
};

export default pwaInstaller;