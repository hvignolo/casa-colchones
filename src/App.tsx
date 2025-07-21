import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Settings,
  Bed,
  ShoppingBag,
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Store,
  User,
  LogOut,
  Lock,
  UserPlus,
} from "lucide-react";

// Tipos TypeScript
interface Product {
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
}

interface StoreData {
  name: string;
  location: string;
  phone: string;
  email: string;
  hours: string;
}

interface User {
  username: string;
  password: string;
  businessName: string;
  registeredAt: string;
}

// Componente para iconos que no están en lucide-react
const Armchair: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
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

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState("main");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Verificar si hay usuario logueado al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setShowLogin(false);
    }
  }, []);

  // Datos iniciales por defecto
  const defaultProducts: Product[] = [
    {
      id: 1,
      codigo: "500077",
      nombre: "Mikonos 140",
      medidas: "140 x 190 x 25",
      tipo: "COLCHONES",
      subtipo: "Resortes Tradicionales",
      precioContado: 370000,
      precioTarjeta: 516400,
      detalles: "Colchón de máxima duración y firmeza con resortes de acero bicónicos. Cuenta con 2 Marcos perimetrales y Estabilizadores laterales de acero que permiten mayor estabilidad. Totalmente matelasseado. Medida 140 x 190 en tela sábana de gran calidad. Medida 100 x190 en Jackard Rojo y de 80 x 190 en Jackard celeste.",
      image: "https://www.reposar.com/76-large_default/mikonos.jpg",
      marca: "Reposar"
    },
    {
      id: 2,
      codigo: "500083",
      nombre: "Mikonos 080",
      medidas: "080 x 190 x 25",
      tipo: "COLCHONES",
      subtipo: "Resortes",
      precioContado: 234000,
      precioTarjeta: 328000,
      detalles: "Colchón de máxima duración y firmeza con resortes de acero bicónicos. Medida 80 x 190 en Jackard celeste.",
      image: "https://www.reposar.com/76-large_default/mikonos.jpg",
      marca: "Reposar"
    },
    {
      id: 3,
      codigo: "500084",
      nombre: "Mikonos 100",
      medidas: "100 x 190 x 25",
      tipo: "COLCHONES",
      subtipo: "Resortes",
      precioContado: 284000,
      precioTarjeta: 398000,
      detalles: "Colchón de máxima duración y firmeza con resortes de acero bicónicos. Medida 100 x190 en Jackard Rojo.",
      image: "https://www.reposar.com/76-large_default/mikonos.jpg",
      marca: "Reposar"
    },
    {
      id: 4,
      codigo: "500011",
      nombre: "T CLAS RES c/p 140",
      medidas: "140 x 190 x 30",
      tipo: "COLCHONES",
      subtipo: "Resortes",
      precioContado: 546000,
      precioTarjeta: 765000,
      detalles: "Colchón con tecnología de resortes clásicos y pillow top para mayor comodidad.",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 5,
      codigo: "500194",
      nombre: "BERLIN EURO 100",
      medidas: "100 x 190 x 30",
      tipo: "COLCHONES",
      subtipo: "Resortes Individuales",
      precioContado: 490000,
      precioTarjeta: 700000,
      detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 6,
      codigo: "500196",
      nombre: "BERLIN EURO 140",
      medidas: "140 x 190 x 30",
      tipo: "COLCHONES",
      subtipo: "Resortes Individuales",
      precioContado: 665600,
      precioTarjeta: 932000,
      detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 7,
      codigo: "500199",
      nombre: "BERLIN EURO 160",
      medidas: "160 x 200 x 35",
      tipo: "COLCHONES",
      subtipo: "Resortes Individuales",
      precioContado: 840000,
      precioTarjeta: 1175000,
      detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 8,
      codigo: "500203",
      nombre: "BERLIN EURO 180",
      medidas: "180 x 200 x 33",
      tipo: "COLCHONES",
      subtipo: "Resortes Individuales",
      precioContado: 933500,
      precioTarjeta: 1307000,
      detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 9,
      codigo: "500195",
      nombre: "BERLIN EURO 200",
      medidas: "200 x 200 x 33",
      tipo: "COLCHONES",
      subtipo: "Resortes Individuales",
      precioContado: 1100000,
      precioTarjeta: 1540000,
      detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 10,
      codigo: "500108",
      nombre: "TM NOCHE 080",
      medidas: "080 x 190 x 20",
      tipo: "COLCHONES",
      subtipo: "Espuma Media Densidad",
      precioContado: 200000,
      precioTarjeta: 283000,
      detalles: "Colchón de espuma de media densidad, ideal para descanso diario.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 11,
      codigo: "500105",
      nombre: "TM NOCHE 100",
      medidas: "100 x 190 x 20",
      tipo: "COLCHONES",
      subtipo: "Espuma Media Densidad",
      precioContado: 226300,
      precioTarjeta: 317000,
      detalles: "Colchón de espuma de media densidad, ideal para descanso diario.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 12,
      codigo: "500107",
      nombre: "TM NOCHE 140",
      medidas: "140 x 190 x 20",
      tipo: "COLCHONES",
      subtipo: "Espuma Media Densidad",
      precioContado: 340000,
      precioTarjeta: 483000,
      detalles: "Colchón de espuma de media densidad, ideal para descanso diario.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 13,
      codigo: "500058",
      nombre: "AREZZO 080",
      medidas: "080 x 190 x 22",
      tipo: "COLCHONES",
      subtipo: "Espuma Alta Densidad",
      precioContado: 248000,
      precioTarjeta: 350000,
      detalles: "Colchón de espuma de alta densidad para mayor durabilidad y confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 14,
      codigo: "500059",
      nombre: "AREZZO 100",
      medidas: "100 x 190 x 22",
      tipo: "COLCHONES",
      subtipo: "Espuma Alta Densidad",
      precioContado: 275000,
      precioTarjeta: 390000,
      detalles: "Colchón de espuma de alta densidad para mayor durabilidad y confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 15,
      codigo: "500060",
      nombre: "AREZZO 140",
      medidas: "140 x 190 x 22",
      tipo: "COLCHONES",
      subtipo: "Espuma Alta Densidad",
      precioContado: 400000,
      precioTarjeta: 562000,
      detalles: "Colchón de espuma de alta densidad para mayor durabilidad y confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 16,
      codigo: "500007",
      nombre: "TC ESPUMA C/P 140",
      medidas: "140 x 190 x 25",
      tipo: "COLCHONES",
      subtipo: "Espuma de Alta Densidad",
      precioContado: 510000,
      precioTarjeta: 715999,
      detalles: "Colchón de espuma de alta densidad con pillow top.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 17,
      codigo: "500198",
      nombre: "THE BEST EURO 080",
      medidas: "080 x 190 x 25",
      tipo: "COLCHONES",
      subtipo: "Espuma Altísima Densidad",
      precioContado: 325000,
      precioTarjeta: 457999,
      detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 18,
      codigo: "500202",
      nombre: "THE BEST EURO 100",
      medidas: "100 x 190 x 25",
      tipo: "COLCHONES",
      subtipo: "Espuma de Altísima Densidad",
      precioContado: 400000,
      precioTarjeta: 560999,
      detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 19,
      codigo: "500204",
      nombre: "THE BEST EURO 140",
      medidas: "140 x 190 x 28",
      tipo: "COLCHONES",
      subtipo: "Espuma de Altísima Densidad",
      precioContado: 618000,
      precioTarjeta: 865000,
      detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 20,
      codigo: "500206",
      nombre: "THE BEST EURO 160",
      medidas: "160 x 200 x 28",
      tipo: "COLCHONES",
      subtipo: "Espuma de Altísima Densidad",
      precioContado: 758000,
      precioTarjeta: 1062000,
      detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 21,
      codigo: "500211",
      nombre: "THE BEST EURO 180",
      medidas: "180 x 200 x 28",
      tipo: "COLCHONES",
      subtipo: "Espuma de Altísima Densidad",
      precioContado: 810000,
      precioTarjeta: 1140000,
      detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 22,
      codigo: "500205",
      nombre: "THE BEST EURO 200",
      medidas: "200 x 200 x 28",
      tipo: "COLCHONES",
      subtipo: "Espuma de Altísima Densidad",
      precioContado: 867000,
      precioTarjeta: 1215000,
      detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 23,
      codigo: "500085",
      nombre: "BOX EXTRA 080",
      medidas: "080 x 190",
      tipo: "OTROS",
      subtipo: "Bajo Sommier",
      precioContado: 84460,
      precioTarjeta: 118200,
      detalles: "Base para sommier de alta calidad y durabilidad.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 24,
      codigo: "500092",
      nombre: "BOX EXTRA 100",
      medidas: "100 x 190",
      tipo: "OTROS",
      subtipo: "Bajo Sommier",
      precioContado: 96820,
      precioTarjeta: 135599,
      detalles: "Base para sommier de alta calidad y durabilidad.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 25,
      codigo: "500095",
      nombre: "BOX EXTRA 140",
      medidas: "140 x 190",
      tipo: "OTROS",
      subtipo: "Bajo Sommier",
      precioContado: 123600,
      precioTarjeta: 174000,
      detalles: "Base para sommier de alta calidad y durabilidad.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 26,
      codigo: "500096",
      nombre: "BOX T CLAS 080",
      medidas: "080 x 200",
      tipo: "OTROS",
      subtipo: "Bajo Sommier",
      precioContado: 99000,
      precioTarjeta: 139000,
      detalles: "Base para sommier clásica con mayor altura.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 27,
      codigo: "500079",
      nombre: "BOX T CLAS 140",
      medidas: "140 x 190",
      tipo: "OTROS",
      subtipo: "Bajo Sommier",
      precioContado: 134000,
      precioTarjeta: 159000,
      detalles: "Base para sommier clásica con mayor altura.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 28,
      codigo: "500460",
      nombre: "BOX BERLIN 090",
      medidas: "090 x 200",
      tipo: "OTROS",
      subtipo: "Box Sommier",
      precioContado: 109000,
      precioTarjeta: 153000,
      detalles: "Box sommier premium línea Berlin.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 29,
      codigo: "500461",
      nombre: "BOX BERLIN 100",
      medidas: "100 x 200",
      tipo: "OTROS",
      subtipo: "Bajo Sommier",
      precioContado: 113500,
      precioTarjeta: 159000,
      detalles: "Box sommier premium línea Berlin.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 30,
      codigo: "500049",
      nombre: "CUNA 97 x 65",
      medidas: "97 x 65",
      tipo: "COLCHONES",
      subtipo: "Para Bebés",
      precioContado: 33000,
      precioTarjeta: 45000,
      detalles: "Colchón especial para cunas de bebé, hipoalergénico.",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 31,
      codigo: "500047",
      nombre: "CUNA 60 x 120",
      medidas: "60 x 120 x 10",
      tipo: "COLCHONES",
      subtipo: "Para Bebés",
      precioContado: 34000,
      precioTarjeta: 47000,
      detalles: "Colchón especial para cunas de bebé, hipoalergénico.",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 32,
      codigo: "500048",
      nombre: "CUNA 80 x 140",
      medidas: "80 x 140 x 10",
      tipo: "COLCHONES",
      subtipo: "Para Bebés",
      precioContado: 57998,
      precioTarjeta: 82000,
      detalles: "Colchón especial para cunas de bebé, hipoalergénico.",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 33,
      codigo: "500391",
      nombre: "RESPALDO COL VS 100",
      medidas: "100 x 120",
      tipo: "RESPALDOS",
      subtipo: "Eco Cuero",
      precioContado: 62000,
      precioTarjeta: 87000,
      detalles: "Respaldo acolchado en eco cuero de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 34,
      codigo: "500358",
      nombre: "RESPALDO COL VS 140",
      medidas: "140 x 120",
      tipo: "RESPALDOS",
      subtipo: "Eco Cuero",
      precioContado: 80000,
      precioTarjeta: 113000,
      detalles: "Respaldo acolchado en eco cuero de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 35,
      codigo: "500363",
      nombre: "RESPALDO COL VS 160",
      medidas: "160 x 120",
      tipo: "RESPALDOS",
      subtipo: "Eco Cuero",
      precioContado: 88000,
      precioTarjeta: 124000,
      detalles: "Respaldo acolchado en eco cuero de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 36,
      codigo: "500465",
      nombre: "RESPALDO COL VS 180",
      medidas: "180 x 120",
      tipo: "RESPALDOS",
      subtipo: "Eco Cuero",
      precioContado: 94000,
      precioTarjeta: 132000,
      detalles: "Respaldo acolchado en eco cuero de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 37,
      codigo: "500466",
      nombre: "RESPALDO COL VS 200",
      medidas: "200 x 120",
      tipo: "RESPALDOS",
      subtipo: "Eco Cuero",
      precioContado: 106000,
      precioTarjeta: 149000,
      detalles: "Respaldo acolchado en eco cuero de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 38,
      codigo: "500342",
      nombre: "RESPALDO CANELON 100",
      medidas: "100 x 120",
      tipo: "RESPALDOS",
      subtipo: "Pana",
      precioContado: 110000,
      precioTarjeta: 156000,
      detalles: "Respaldo premium tapizado en pana de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 39,
      codigo: "500343",
      nombre: "RESPALDO CANELON 140",
      medidas: "140 x 120",
      tipo: "RESPALDOS",
      subtipo: "Pana",
      precioContado: 166200,
      precioTarjeta: 238000,
      detalles: "Respaldo premium tapizado en pana de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 40,
      codigo: "500344",
      nombre: "RESPALDO CANELON 160",
      medidas: "160 x 120",
      tipo: "RESPALDOS",
      subtipo: "Pana",
      precioContado: 197800,
      precioTarjeta: 278000,
      detalles: "Respaldo premium tapizado en pana de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 41,
      codigo: "500345",
      nombre: "RESPALDO CANELON 180",
      medidas: "180 x 120",
      tipo: "RESPALDOS",
      subtipo: "Pana",
      precioContado: 213000,
      precioTarjeta: 299800,
      detalles: "Respaldo premium tapizado en pana de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 42,
      codigo: "500346",
      nombre: "RESPALDO CANELON 200",
      medidas: "200 x 120",
      tipo: "RESPALDOS",
      subtipo: "Pana",
      precioContado: 230000,
      precioTarjeta: 322000,
      detalles: "Respaldo premium tapizado en pana de alta calidad.",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    // SOMMIERS
    {
      id: 43,
      codigo: "SOM762",
      nombre: "Sommier TM NOCHE 080",
      medidas: "080 x 190 x 20",
      tipo: "SOMMIERS",
      subtipo: "Espuma Media Densidad",
      precioContado: 284460,
      precioTarjeta: 401200,
      detalles: "Sommier completo con colchón TM Noche y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 44,
      codigo: "SOM295",
      nombre: "Sommier TM NOCHE 100",
      medidas: "100 x 190 x 20",
      tipo: "SOMMIERS",
      subtipo: "Espuma Media Densidad",
      precioContado: 323120,
      precioTarjeta: 452599,
      detalles: "Sommier completo con colchón TM Noche y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 45,
      codigo: "SOM841",
      nombre: "Sommier TM NOCHE 140",
      medidas: "140 x 190 x 20",
      tipo: "SOMMIERS",
      subtipo: "Espuma Media Densidad",
      precioContado: 463600,
      precioTarjeta: 657000,
      detalles: "Sommier completo con colchón TM Noche y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 46,
      codigo: "SOM624",
      nombre: "Sommier AREZZO 080",
      medidas: "080 x 190 x 22",
      tipo: "SOMMIERS",
      subtipo: "Espuma Alta Densidad",
      precioContado: 332460,
      precioTarjeta: 468200,
      detalles: "Sommier completo con colchón Arezzo y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 47,
      codigo: "SOM189",
      nombre: "Sommier AREZZO 100",
      medidas: "100 x 190 x 22",
      tipo: "SOMMIERS",
      subtipo: "Espuma Alta Densidad",
      precioContado: 371820,
      precioTarjeta: 525599,
      detalles: "Sommier completo con colchón Arezzo y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 48,
      codigo: "SOM456",
      nombre: "Sommier AREZZO 140",
      medidas: "140 x 190 x 22",
      tipo: "SOMMIERS",
      subtipo: "Espuma Alta Densidad",
      precioContado: 523600,
      precioTarjeta: 736000,
      detalles: "Sommier completo con colchón Arezzo y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 49,
      codigo: "SOM732",
      nombre: "Sommier MIKONOS 140",
      medidas: "140 x 190 x 25",
      tipo: "SOMMIERS",
      subtipo: "Resortes Tradicionales",
      precioContado: 493600,
      precioTarjeta: 690400,
      detalles: "Sommier completo con colchón Mikonos y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    },
    {
      id: 50,
      codigo: "SOM918",
      nombre: "Sommier MIKONOS 080",
      medidas: "080 x 190 x 25",
      tipo: "SOMMIERS",
      subtipo: "Resortes",
      precioContado: 318460,
      precioTarjeta: 446200,
      detalles: "Sommier completo con colchón Mikonos y box incluido.",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
      marca: "Reposar"
    }
  ];


  // Funciones para localStorage con prefijo de usuario
  const getUserKey = (key: string) => `user_${currentUser?.username}_${key}`;

  const saveToLocalStorage = (key: string, data: any) => {
    if (!currentUser) return;
    try {
      localStorage.setItem(getUserKey(key), JSON.stringify(data));
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  };

  const loadFromLocalStorage = (key: string, defaultValue: any) => {
    if (!currentUser) return defaultValue;
    try {
      const saved = localStorage.getItem(getUserKey(key));
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error("Error cargando desde localStorage:", error);
      return defaultValue;
    }
  };

  // Funciones de autenticación
  const getUsers = (): Record<string, User> => {
    try {
      const users = localStorage.getItem("app_users");
      return users ? JSON.parse(users) : {};
    } catch (error) {
      return {};
    }
  };

  const saveUsers = (users: Record<string, User>) => {
    try {
      localStorage.setItem("app_users", JSON.stringify(users));
    } catch (error) {
      console.error("Error guardando usuarios:", error);
    }
  };

  const handleLogin = (username: string, password: string, businessName: string): boolean => {
    const users = getUsers();

    if (loginMode === "register") {
      if (users[username]) {
        return false;
      }

      users[username] = {
        username,
        password,
        businessName,
        registeredAt: new Date().toISOString(),
      };
      saveUsers(users);

      const newUser = users[username];
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setShowLogin(false);
      showToastMessage(
        `¡Bienvenido ${businessName}! Usuario creado exitosamente`
      );
      return true;
    } else {
      const user = users[username];
      if (user && user.password === password) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setShowLogin(false);
        showToastMessage(`¡Bienvenido de vuelta, ${user.businessName}!`);
        return true;
      } else {
        return false;
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que quieres cerrar sesión?")) {
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      setShowLogin(true);
      setSearchQuery("");
      setActiveFilter("TODOS");
      setShowSettings(false);
      setSettingsView("main");
      setEditingProduct(null);
      setShowProductForm(false);
      setSelectedProduct(null);
      showToastMessage("Sesión cerrada exitosamente");
    }
  };

  // Datos de la tienda con persistencia por usuario
  const [storeData, setStoreData] = useState<StoreData>(() => {
    if (!currentUser) return {
      name: "Mi Tienda",
      location: "Av. Principal 123, Centro",
      phone: "(0379) 123-4567",
      email: "info@mitienda.com",
      hours: "Lun-Vie 9:00-18:00, Sáb 9:00-13:00",
    };
    return loadFromLocalStorage("storeData", {
      name: currentUser?.businessName || "Mi Tienda",
      location: "Av. Principal 123, Centro",
      phone: "(0379) 123-4567",
      email: "info@mitienda.com",
      hours: "Lun-Vie 9:00-18:00, Sáb 9:00-13:00",
    });
  });

  // Datos de productos con persistencia por usuario
  const [products, setProducts] = useState<Product[]>(() => {
    if (!currentUser) return [];
    return loadFromLocalStorage("products", defaultProducts);
  });

  // Recargar datos cuando cambia el usuario
  useEffect(() => {
    if (currentUser) {
      const userData = loadFromLocalStorage("storeData", {
        name: currentUser.businessName,
        location: "Av. Principal 123, Centro",
        phone: "(0379) 123-4567",
        email: "info@mitienda.com",
        hours: "Lun-Vie 9:00-18:00, Sáb 9:00-13:00",
      });
      setStoreData(userData);

      const userProducts = loadFromLocalStorage("products", defaultProducts);
      setProducts(userProducts);
    }
  }, [currentUser]);

  // Guardar datos automáticamente cuando cambien
  useEffect(() => {
    if (currentUser && storeData.name) {
      saveToLocalStorage("storeData", storeData);
    }
  }, [storeData, currentUser]);

  useEffect(() => {
    if (currentUser && products.length > 0) {
      saveToLocalStorage("products", products);
    }
  }, [products, currentUser]);

  const filterChips = [
    { id: "TODOS", label: "Todos", icon: ShoppingBag },
    { id: "COLCHONES", label: "Colchones", icon: Bed },
    { id: "SOMMIERS", label: "Sommiers", icon: Bed },
    { id: "RESPALDOS", label: "Respaldos", icon: Armchair },
    { id: "ALMOHADAS", label: "Almohadas", icon: Package },
    { id: "OTROS", label: "Otros", icon: ShoppingBag },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeFilter !== "TODOS") {
      filtered = filtered.filter((product) => product.tipo === activeFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.subtipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.detalles.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeFilter, searchQuery, products]);

  const handleDeleteProduct = (id: number) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...productData, id: editingProduct.id }
            : p
        )
      );
      setEditingProduct(null);
    } else {
      const newProduct = {
        ...productData,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
      };
      setProducts([...products, newProduct]);
    }
    setShowProductForm(false);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Funciones para exportar/importar datos
  const exportData = () => {
    const data = {
      products,
      storeData,
      user: currentUser?.username,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentUser?.username}-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToastMessage("¡Datos exportados exitosamente!");
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.products) {
          setProducts(data.products);
        }
        if (data.storeData) {
          setStoreData(data.storeData);
        }

        showToastMessage("¡Datos importados exitosamente!");
      } catch (error) {
        showToastMessage("Error al importar datos. Verifica el archivo.");
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer."
      )
    ) {
      setProducts(defaultProducts);
      setStoreData({
        name: currentUser?.businessName || "Casa de Colchones",
        location: "Av. Principal 123, Centro",
        phone: "(0379) 123-4567",
        email: "info@mitienda.com",
        hours: "Lun-Vie 9:00-18:00, Sáb 9:00-13:00",
      });
      showToastMessage("¡Datos restablecidos a valores por defecto!");
    }
  };

  // Componente de Login
  const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
      username: "",
      password: "",
      businessName: "",
    });
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");
      setIsLoading(true);

      if (!formData.username.trim()) {
        setLoginError("El usuario es requerido");
        setIsLoading(false);
        return;
      }

      if (!formData.password.trim()) {
        setLoginError("La contraseña es requerida");
        setIsLoading(false);
        return;
      }

      if (loginMode === "register" && !formData.businessName.trim()) {
        setLoginError("El nombre del negocio es requerido");
        setIsLoading(false);
        return;
      }

      if (loginMode === "register") {
        if (formData.username.length < 3) {
          setLoginError("El usuario debe tener al menos 3 caracteres");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 4) {
          setLoginError("La contraseña debe tener al menos 4 caracteres");
          setIsLoading(false);
          return;
        }

        if (formData.businessName.length < 3) {
          setLoginError(
            "El nombre del negocio debe tener al menos 3 caracteres"
          );
          setIsLoading(false);
          return;
        }
      }

      setTimeout(() => {
        const success = handleLogin(
          formData.username,
          formData.password,
          formData.businessName
        );
        if (!success) {
          setLoginError(
            loginMode === "login"
              ? "Usuario o contraseña incorrectos"
              : "El usuario ya existe, intenta con otro nombre"
          );
        }
        setIsLoading(false);
      }, 800);
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-black bg-opacity-40" />

        <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white border-opacity-20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Casa de Colchones
            </h1>
            <p className="text-gray-600">
              {loginMode === "login"
                ? "Inicia sesión en tu cuenta"
                : "Crea tu cuenta de negocio"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 font-medium text-sm">
                    {loginError}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (loginError) setLoginError("");
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 ${
                  loginError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (loginError) setLoginError("");
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 ${
                  loginError ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
            </div>

            {loginMode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => {
                    setFormData({ ...formData, businessName: e.target.value });
                    if (loginError) setLoginError("");
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white bg-opacity-90 ${
                    loginError ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Ej: Casa de Colchones Miranda"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Procesando...
                </>
              ) : loginMode === "login" ? (
                <>
                  <Lock className="w-5 h-5" />
                  Iniciar Sesión
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setLoginMode(loginMode === "login" ? "register" : "login");
                setLoginError("");
                setFormData({ username: "", password: "", businessName: "" });
              }}
              className="text-blue-700 hover:text-blue-800 font-medium bg-white bg-opacity-80 px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {loginMode === "login"
                ? "¿No tienes cuenta? Regístrate aquí"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente ProductForm
  const ProductForm: React.FC<{
    product: Product | null;
    onSave: (product: Omit<Product, 'id'>) => void;
    onCancel: () => void;
  }> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      product || {
        codigo: "",
        nombre: "",
        medidas: "",
        tipo: "COLCHONES",
        subtipo: "",
        precioContado: 0,
        precioTarjeta: 0,
        detalles: "",
        image: "",
        marca: "",
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...formData,
        precioContado: Number(formData.precioContado),
        precioTarjeta: Number(formData.precioTarjeta),
      });
    };

    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="COLCHONES">Colchones</option>
                <option value="SOMMIERS">Sommiers</option>
                <option value="RESPALDOS">Respaldos</option>
                <option value="ALMOHADAS">Almohadas</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtipo
              </label>
              <input
                type="text"
                value={formData.subtipo}
                onChange={(e) =>
                  setFormData({ ...formData, subtipo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Viscoelástico, Resortes, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medidas
            </label>
            <input
              type="text"
              value={formData.medidas}
              onChange={(e) =>
                setFormData({ ...formData, medidas: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 2.00 x 1.40 x 0.25m"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Contado
              </label>
              <input
                type="number"
                value={formData.precioContado}
                onChange={(e) =>
                  setFormData({ ...formData, precioContado: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Tarjeta
              </label>
              <input
                type="number"
                value={formData.precioTarjeta}
                onChange={(e) =>
                  setFormData({ ...formData, precioTarjeta: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Imagen
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detalles
            </label>
            <textarea
              value={formData.detalles}
              onChange={(e) =>
                setFormData({ ...formData, detalles: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  };

  const StoreForm: React.FC = () => {
    const [formData, setFormData] = useState(storeData);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStoreData(formData);
      showToastMessage("¡Datos de la tienda actualizados correctamente!");

      setTimeout(() => {
        setShowSettings(false);
        setSettingsView("main");
      }, 1000);
    };

    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Tienda
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horarios
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) =>
                setFormData({ ...formData, hours: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Lun-Vie 9:00-18:00"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Guardar Cambios
          </button>
        </form>
      </div>
    );
  };

  const Toast: React.FC = () => {
    if (!showToast) return null;

    return (
      <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
        <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{toastMessage}</span>
        </div>
      </div>
    );
  };

  const ProductDetailModal: React.FC<{
    product: Product | null;
    onClose: () => void;
  }> = ({ product, onClose }) => {
    if (!product) return null;

   // Función para compartir por WhatsApp (Versión mejorada)
const shareOnWhatsApp = () => {
  // Asegúrate de que la URL de la imagen sea absoluta (que empiece con http:// o https://)
  const imageUrl = product.image; // Ej: 'https://www.miweb.com/imagenes/producto123.jpg'

  const message = `*${storeData.name}*
      
*${product.nombre}*
• Código: ${product.codigo}
• Marca: ${product.marca}
• Medidas: ${product.medidas}
• Tipo: ${product.tipo} - ${product.subtipo}

*PRECIOS:*
• Contado: ${product.precioContado.toLocaleString()}
• Tarjeta: ${product.precioTarjeta.toLocaleString()}
• Ahorrás: ${(product.precioTarjeta - product.precioContado).toLocaleString()} pagando de contado

*Descripción:*
${product.detalles}

*Imagen del producto:*
${imageUrl}

*Contacto:*
• Ubicación: ${storeData.location}
• Teléfono: ${storeData.phone}
• Horarios: ${storeData.hours}

¡Consultá por este producto y más opciones!`;

  const encodedMessage = encodeURIComponent(message);
  
  // Puedes opcionalmente agregar un número de teléfono:
  // const whatsappUrl = `https://wa.me/${storeData.phone}?text=${encodedMessage}`;
  
  // O dejar que el usuario elija el contacto:
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  // Abrir WhatsApp en una nueva ventana/pestaña
  window.open(whatsappUrl, '_blank');
};
    
   

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.nombre}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Código: {product.codigo}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {product.tipo}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Precios
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Precio de Contado</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${product.precioContado.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Precio con Tarjeta</span>
                      <span className="text-xl font-semibold text-blue-600">
                        ${product.precioTarjeta.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Ahorro pagando de contado
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          $
                          {(
                            product.precioTarjeta - product.precioContado
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Marca</h4>
                    <p className="text-gray-700">{product.marca}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Subtipo</h4>
                    <p className="text-gray-700">{product.subtipo}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-2">Medidas</h4>
                    <p className="text-gray-700">{product.medidas}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Descripción
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {product.detalles}
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
  onClick={shareOnWhatsApp}
  className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
  Compartir por WhatsApp
</button>
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Solicitar más información
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SettingsModal: React.FC = () => {
    const renderContent = () => {
      if (showProductForm) {
        return (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h3>
            </div>
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        );
      }

      switch (settingsView) {
        case "products":
          return (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSettingsView("main")}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-semibold">
                    Gestión de Productos
                  </h3>
                </div>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Agregar
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {product.nombre}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Código: {product.codigo}
                        </p>
                        <p className="text-xs text-gray-600">
                          Tipo: {product.tipo}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          Contado: ${product.precioContado.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowProductForm(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case "store":
          return (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setSettingsView("main")}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">Datos de la Tienda</h3>
              </div>
              <StoreForm />
            </div>
          );

        case "data":
          return (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setSettingsView("main")}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">Gestión de Datos</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Exportar Datos
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Descarga una copia de seguridad de todos tus productos y
                    configuración.
                  </p>
                  <button
                    onClick={exportData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    📥 Descargar Backup
                  </button>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Importar Datos
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    Restaura datos desde un archivo de backup.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors cursor-pointer inline-block"
                  >
                    📤 Subir Backup
                  </label>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">
                    Restablecer Datos
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Volver a los datos por defecto. Esta acción no se puede
                    deshacer.
                  </p>
                  <button
                    onClick={resetData}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    🔄 Restablecer
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Estado Actual
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Productos:</span>
                      <span className="ml-2 font-medium">
                        {products.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Usuario:</span>
                      <span className="ml-2 font-medium">
                        {currentUser?.username}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Configuración
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setSettingsView("products")}
                  className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Gestión de Productos
                      </h3>
                      <p className="text-sm text-gray-600">
                        Agregar, editar y eliminar productos
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSettingsView("store")}
                  className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Datos de la Tienda
                      </h3>
                      <p className="text-sm text-gray-600">
                        Nombre, ubicación, contacto
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSettingsView("data")}
                  className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Gestión de Datos
                      </h3>
                      <p className="text-sm text-gray-600">
                        Backup, importar, exportar
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">
                  Información Actual
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Usuario:</strong> {currentUser?.username}
                  </p>
                  <p>
                    <strong>Tienda:</strong> {storeData.name}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {storeData.location}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {storeData.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {storeData.email}
                  </p>
                  <p>
                    <strong>Productos:</strong> {products.length} items
                  </p>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button
              onClick={() => {
                setShowSettings(false);
                setSettingsView("main");
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    );
  };

  // Si no hay usuario logueado, mostrar el login
  if (showLogin || !currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">
                {storeData.name}
              </h1>
              <span className="text-sm text-gray-500">•</span>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {currentUser.username}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por código, nombre, marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>
      </header>

      {/* Filter Chips */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterChips.map((chip) => {
            const IconComponent = chip.icon;
            const isActive = activeFilter === chip.id;

            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <main className="pb-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            <p className="text-gray-400 text-sm mt-2">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden xl:block">
              <div className="bg-white mx-4 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 min-w-[200px]">
                          Producto
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Código
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Tipo
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Medidas
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">
                          Marca
                        </th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-900">
                          Precio Contado
                        </th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-900">
                          Precio Tarjeta
                        </th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-gray-900">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.nombre}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {product.nombre}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {product.subtipo}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 font-mono">
                            {product.codigo}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.tipo}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {product.medidas}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {product.marca}
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-semibold text-green-600">
                            ${product.precioContado.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-semibold text-blue-600">
                            ${product.precioTarjeta.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleViewProduct(product)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tablet List */}
            <div className="hidden lg:block xl:hidden px-4 space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewProduct(product)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                            {product.nombre}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {product.subtipo} • {product.marca}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {product.codigo}
                          </p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-green-600 font-bold text-sm">
                            ${product.precioContado.toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600">
                            ${product.precioTarjeta.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.tipo}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {product.medidas}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden px-4 space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewProduct(product)}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {product.nombre}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {product.subtipo}
                          </p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <p className="text-green-600 font-bold text-sm">
                            ${product.precioContado.toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600">
                            ${product.precioTarjeta.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Código:</span>
                          <span className="ml-1 font-mono font-medium">
                            {product.codigo}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Marca:</span>
                          <span className="ml-1 font-medium">
                            {product.marca}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Medidas:</span>
                          <span className="ml-1 font-medium">
                            {product.medidas}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.tipo}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(product);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Toast Notification */}
      <Toast />

      {/* Settings Modal */}
      {showSettings && <SettingsModal />}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseProductDetail}
        />
      )}
    </div>
  );
};

export default App;