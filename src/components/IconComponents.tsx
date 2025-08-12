import React from 'react';
import {
  Search,
  Settings,
  Bed,
  ShoppingBag,
  Package,
  User,
  LogOut,
  Calculator,
  FilePlus,
  Grid3X3,
  Layers,
  Circle,
  Square,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { FilterChip } from '../types';
import { FILTER_CHIPS_CONFIG } from '../constants';

/**
 * Componente para iconos que no están en lucide-react
 */
export const Armchair: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// NUEVOS ICONOS AGREGADOS PARA FUNCIONALIDAD OFFLINE

/**
 * Componente para icono de sommier personalizado
 */
export const SommierIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="2" />
    <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" strokeWidth="2" />
    <line x1="2" y1="10" x2="22" y2="10" strokeWidth="1" />
    <line x1="2" y1="14" x2="22" y2="14" strokeWidth="1" />
    <circle cx="6" cy="12" r="1" fill="currentColor" />
    <circle cx="10" cy="12" r="1" fill="currentColor" />
    <circle cx="14" cy="12" r="1" fill="currentColor" />
    <circle cx="18" cy="12" r="1" fill="currentColor" />
  </svg>
);

/**
 * Componente para icono de resortes
 */
export const SpringIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M4 6c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2zm0 0v12c0 1 1 2 2 2s2-1 2-2V6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path 
      d="M10 6c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2zm0 0v12c0 1 1 2 2 2s2-1 2-2V6"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path 
      d="M16 6c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2zm0 0v12c0 1 1 2 2 2s2-1 2-2V6"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Componente para icono de espuma
 */
export const FoamIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="6" width="18" height="12" rx="3" strokeWidth="2" />
    <circle cx="7" cy="10" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="17" cy="11" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="9" cy="14" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="15" cy="15" r="1.2" fill="currentColor" opacity="0.4" />
    <path d="M3 14c2-1 4-1 6 0s4 1 6 0 4-1 6 0" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

/**
 * Componente para icono de respaldo
 */
export const BackrestIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" />
    <rect x="6" y="4" width="12" height="3" rx="1" fill="currentColor" opacity="0.3" />
    <rect x="6" y="9" width="12" height="3" rx="1" fill="currentColor" opacity="0.3" />
    <rect x="6" y="14" width="12" height="3" rx="1" fill="currentColor" opacity="0.3" />
    <line x1="4" y1="22" x2="8" y2="22" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="22" x2="20" y2="22" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/**
 * Componente para icono de almohada
 */
export const PillowIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="12" cy="12" rx="9" ry="6" strokeWidth="2" />
    <path 
      d="M3 12c0-2 2-4 4-4h10c2 0 4 2 4 4 0 2-2 4-4 4H7c-2 0-4-2-4-4z" 
      fill="currentColor" 
      opacity="0.1"
    />
    <path d="M8 10c1 0 2 1 2 2s-1 2-2 2" strokeWidth="1.5" opacity="0.6" />
    <path d="M16 10c-1 0-2 1-2 2s1 2 2 2" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

/**
 * Mapa de iconos disponibles (ACTUALIZADO con nuevos iconos)
 */
const ICON_MAP = {
  ShoppingBag,
  Bed,
  Package,
  Armchair,
  Search,
  Settings,
  User,
  LogOut,
  Calculator,
  FilePlus,
  // Nuevos iconos agregados
  Grid3X3,
  SommierIcon,
  SpringIcon,
  FoamIcon,
  BackrestIcon,
  PillowIcon,
  Layers,
  Circle,
  Square,
  Wifi,
  WifiOff,
  RefreshCw
} as const;

/**
 * Configuración completa de los chips de filtros con iconos
 * NOTA: Si FILTER_CHIPS_CONFIG no incluye los nuevos filtros, usa la configuración de fallback
 */
export const FILTER_CHIPS: FilterChip[] = FILTER_CHIPS_CONFIG?.map(chip => ({
  id: chip.id,
  label: chip.label,
  icon: ICON_MAP[chip.iconType as keyof typeof ICON_MAP]
})) || [
  // Configuración de fallback si FILTER_CHIPS_CONFIG no existe o no tiene los nuevos
  {
    id: 'TODOS',
    label: 'Todos',
    icon: Grid3X3
  },
  {
    id: 'COLCHONES',
    label: 'Colchones',
    icon: Bed
  },
  {
    id: 'SOMMIERS',
    label: 'Sommiers',
    icon: SommierIcon
  },
  {
    id: 'RESORTES',
    label: 'Resortes',
    icon: SpringIcon
  },
  {
    id: 'ESPUMA',
    label: 'Espuma',
    icon: FoamIcon
  },
  {
    id: 'RESPALDOS',
    label: 'Respaldos',
    icon: BackrestIcon
  },
  {
    id: 'ALMOHADAS',
    label: 'Almohadas',
    icon: PillowIcon
  },
  {
    id: 'OTROS',
    label: 'Otros',
    icon: Package
  }
];

/**
 * Obtiene un icono por su nombre
 */
export const getIcon = (iconName: keyof typeof ICON_MAP) => {
  return ICON_MAP[iconName];
};

/**
 * Componente de icono dinámico
 */
export const DynamicIcon: React.FC<{
  name: keyof typeof ICON_MAP;
  className?: string;
}> = ({ name, className }) => {
  const IconComponent = ICON_MAP[name];
  return <IconComponent className={className} />;
};

// NUEVAS FUNCIONES AGREGADAS PARA LA FUNCIONALIDAD OFFLINE

/**
 * Función para obtener el icono según el tipo de producto
 */
export const getProductTypeIcon = (tipo: string): React.ComponentType<{ className?: string }> => {
  switch (tipo.toLowerCase()) {
    case 'colchones':
      return Bed;
    case 'sommiers':
      return SommierIcon;
    case 'respaldos':
      return BackrestIcon;
    case 'almohadas':
      return PillowIcon;
    case 'otros':
      return Package;
    default:
      return Package;
  }
};

/**
 * Función para obtener el icono según el subtipo de producto
 */
export const getProductSubtypeIcon = (subtipo: string): React.ComponentType<{ className?: string }> => {
  const subtipoLower = subtipo.toLowerCase();
  
  if (subtipoLower.includes('resorte')) {
    return SpringIcon;
  }
  
  if (subtipoLower.includes('espuma')) {
    return FoamIcon;
  }
  
  if (subtipoLower.includes('individual')) {
    return Circle;
  }
  
  if (subtipoLower.includes('tradicional')) {
    return Square;
  }
  
  return Layers;
};

/**
 * Componente de icono dinámico que selecciona automáticamente según el tipo
 */
export const DynamicProductIcon: React.FC<{
  tipo: string;
  subtipo?: string;
  className?: string;
}> = ({ tipo, subtipo, className }) => {
  let IconComponent = getProductTypeIcon(tipo);
  
  // Si hay subtipo y es específico, usar ese icono
  if (subtipo) {
    const subtipoIcon = getProductSubtypeIcon(subtipo);
    if (subtipoIcon !== Layers) {
      IconComponent = subtipoIcon;
    }
  }
  
  return <IconComponent className={className} />;
};

export default FILTER_CHIPS;