// Interfaz principal para los productos
export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  medidas: string;
  tipo: string;
  subtipo: string;
  precioContado: number;
  precioTarjeta: number;
  detalles: string;
  image: string;
  marca: string;
  stock?: number;
  images?: string[];
}

// Interfaz para los datos de la tienda
export interface StoreData {
  name: string;
  location: string;
  phone: string;
  email: string;
  hours: string;
}

// Interfaz para los usuarios del sistema
export interface User {
  username: string;
  password: string;
  businessName: string;
  registeredAt: string;
}

// Tipos para los modos de autenticación
export type LoginMode = "login" | "register";

// Interfaz para los filtros de productos
export interface FilterChip {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Interfaz para los datos del formulario de login
export interface LoginFormData {
  username: string;
  password: string;
  businessName: string;
}

// Interfaz para las props del ProductForm
export interface ProductFormProps {
  product: Product | null;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

// Interfaz para las props del ProductDetailModal
export interface ProductDetailModalProps {
  product: Product | null;
  storeData: StoreData;
  onClose: () => void;
}

// Interfaz para las props del PaymentCalculatorModal
export interface PaymentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interfaz para las props del CartolaModal
export interface CartolaModalProps {
  open: boolean;
  onClose: () => void;
}

// Tipos para las vistas del modal de configuración
export type SettingsView = "main" | "products" | "store" | "data" | "prices";

// Interfaz para los datos de exportación/importación
export interface ExportData {
  products: Product[];
  storeData: StoreData;
  user: string;
  exportDate: string;
}

// Mapeo de códigos de sommiers a sus componentes
export type SommierMapping = Record<string, string[]>;

// Interfaz para el resultado del cálculo de pagos
export interface PaymentCalculationResult {
  provider: string;
  gross: number;
  installmentValue: number;
  commissionRate: number;
  financeRate: number;
}

// Tipos para las opciones de tarjetas en la calculadora
export type CardType = 'viumi' | 'naranja' | 'payway' | 'otro';

// Interfaz para las comisiones y tasas de financiación
export interface CommissionAndFinance {
  com: number;
  fin: number;
}

// Constantes para las tasas (pueden ser útiles si se externalizan)
export interface PaymentRates {
  VAT: number;
  viumiCommissions: Record<number, number>;
  viumiFinance: Record<number, number>;
  mipymeFinance: Record<number, number>;
  viumiMacroPromo: Record<number, Record<number, number>>;
  naranjaCommissions: Record<number, number>;
  naranjaFinance: Record<number, number>;
  paywayCommission: number;
  paywayCoeffNoVAT: Record<number, number>;
}

// Tipos para los estilos de cartola (si se necesitan en otros lugares)
export type EstiloCartola =
  | 'modern'
  | 'original'
  | 'minimal'
  | 'gradient'
  | 'dark'
  | 'geometric'
  | 'wellness'
  | 'sale'
  | 'delicate';

// Interfaz para los datos de una cartola
export interface CartolaData {
  titulo: string;
  oferta: string;
  producto: string;
  precioActual: string;
  precioAnterior: string;
  caracteristica1: string;
  caracteristica2: string;
  caracteristica3: string;
  mensajeFinal: string;
}

// Interfaz para los estilos de campos de cartola
export interface FieldStyle {
  bold: boolean;
  color: string;
  spacing: number;
  fontSize: number;
}

// Tipo para los estilos de todos los campos de cartola
export type CartolaStyles = {
  [K in keyof CartolaData]: FieldStyle;
};

// Interfaz para una cartola guardada
export interface SavedCartola {
  data: CartolaData;
  estilo: EstiloCartola;
  styles: CartolaStyles;
  name: string;
}

// Interfaz para las configuraciones de campos en formularios dinámicos
export interface FieldConfig {
  field: keyof CartolaData;
  label: string;
  textarea?: boolean;
  rows?: number;
  placeholder: string;
}

// Tipo para las funciones de localStorage
export type LocalStorageHandler = (key: string, data?: any) => any;

// Interfaz para las props de componentes toast/notificación
export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Tipos para eventos de input comunes
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

// Tipo para funciones de callback comunes
export type VoidCallback = () => void;
export type StringCallback = (value: string) => void;
export type NumberCallback = (value: number) => void;
export type BooleanCallback = (value: boolean) => void;

// Interfaz para componentes con children
export interface WithChildren {
  children: React.ReactNode;
}

// Tipo para clases CSS opcionales
export type OptionalClassName = {
  className?: string;
};

// Interfaz genérica para componentes modales
export interface BaseModalProps {
  isOpen: boolean;
  onClose: VoidCallback;
  title?: string;
}

// Tipo para los estados de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Interfaz para manejo de errores
export interface ErrorState {
  hasError: boolean;
  message: string;
}

// Constantes de tipos para los tipos de productos
export const PRODUCT_TYPES = {
  COLCHONES: 'COLCHONES',
  SOMMIERS: 'SOMMIERS',
  RESPALDOS: 'RESPALDOS',
  ALMOHADAS: 'ALMOHADAS',
  OTROS: 'OTROS'
} as const;

export type ProductType = typeof PRODUCT_TYPES[keyof typeof PRODUCT_TYPES];

// Constantes para los filtros
export const FILTER_IDS = {
  TODOS: 'TODOS',
  COLCHONES: 'COLCHONES',
  SOMMIERS: 'SOMMIERS',
  RESORTES: 'RESORTES',
  ESPUMA: 'ESPUMA',
  RESPALDOS: 'RESPALDOS',
  ALMOHADAS: 'ALMOHADAS',
  OTROS: 'OTROS'
} as const;

export type FilterId = typeof FILTER_IDS[keyof typeof FILTER_IDS];

// Interface for Personal Accounts (Tracking installment sales without cards)
export interface PersonalAccount {
  id?: string; // Optional for creation, populated from Firestore
  customerName: string;
  dni?: string;     // Optional identification
  phone?: string;   // Optional contact info
  address?: string; // Optional delivery address
  productDetails: string;
  initialPayment?: number; // Entrega inicial
  initialPaymentMethod?: string; // Medio de pago de la entrega
  totalInstallments: number;
  paidInstallments: number;
  amountPerInstallment: number;
  isDelivered: boolean;
  startDate: string; // ISO date string
  lastPaymentDate?: string; // ISO date string
  status: 'active' | 'completed' | 'late' | 'canceled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}