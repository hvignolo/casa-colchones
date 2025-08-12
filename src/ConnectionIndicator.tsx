import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionIndicatorProps {
  className?: string;
}

const ConnectionIndicator: React.FC<ConnectionIndicatorProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showSyncAnimation, setShowSyncAnimation] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncAnimation(true);
      
      // Simular sincronización
      setTimeout(() => {
        setShowSyncAnimation(false);
        setLastSyncTime(new Date());
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSyncAnimation(false);
    };

    const handleConnectionChange = (event: CustomEvent) => {
      const { isOnline: online } = event.detail;
      if (online) {
        handleOnline();
      } else {
        handleOffline();
      }
    };

    const handleSyncComplete = () => {
      setShowSyncAnimation(false);
      setLastSyncTime(new Date());
    };

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('connectionchange', handleConnectionChange as EventListener);
    window.addEventListener('syncComplete', handleSyncComplete);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('connectionchange', handleConnectionChange as EventListener);
      window.removeEventListener('syncComplete', handleSyncComplete);
    };
  }, []);

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'hace un momento';
    if (diffMins < 60) return `hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `hace ${diffHours}h`;
    
    return date.toLocaleDateString();
  };

  if (isOnline && !showSyncAnimation && !lastSyncTime) {
    return null; // No mostrar nada si está online y no hay actividad especial
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Indicador principal */}
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
          isOnline
            ? showSyncAnimation
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}
      >
        {showSyncAnimation ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sincronizando...</span>
          </>
        ) : isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Sin conexión</span>
          </>
        )}
      </div>

      {/* Información adicional para modo offline */}
      {!isOnline && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          <span>Modo offline activo</span>
        </div>
      )}

      {/* Última sincronización */}
      {lastSyncTime && isOnline && !showSyncAnimation && (
        <div className="hidden md:flex text-xs text-gray-400">
          Sync: {formatLastSync(lastSyncTime)}
        </div>
      )}
    </div>
  );
};

export default ConnectionIndicator;