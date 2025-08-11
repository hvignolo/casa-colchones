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

/**
 * Mapa de iconos disponibles
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
} as const;

/**
 * Configuración completa de los chips de filtros con iconos
 */
export const FILTER_CHIPS: FilterChip[] = FILTER_CHIPS_CONFIG.map(chip => ({
  id: chip.id,
  label: chip.label,
  icon: ICON_MAP[chip.iconType as keyof typeof ICON_MAP]
}));

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