// Tipos TypeScript para los productos
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
}

// Lista de precios actualizada al 28/07/2025 - Generada automáticamente
export const defaultProducts: Product[] = [
  // COLCHONES - BAJA DENSIDAD
  {
    id: 1,
    codigo: "500040",
    nombre: "JUVENIL D-15",
    medidas: "80 x 190 x 18",
    tipo: "COLCHONES",
    subtipo: "Baja Densidad",
    precioContado: 166521,
    precioTarjeta: 233129,
    detalles: "Colchón juvenil de baja densidad, ideal para uso ocasional.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // COLCHONES - ESPUMA MEDIA DENSIDAD
  {
    id: 2,
    codigo: "500108",
    nombre: "TM NOCHE 080",
    medidas: "080 x 190 x 20",
    tipo: "COLCHONES",
    subtipo: "Espuma Media Densidad",
    precioContado: 218963,
    precioTarjeta: 306548,
    detalles: "Colchón de espuma de media densidad, ideal para descanso diario.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 3,
    codigo: "500105",
    nombre: "TM NOCHE 100",
    medidas: "100 x 190 x 20",
    tipo: "COLCHONES",
    subtipo: "Espuma Media Densidad",
    precioContado: 245951,
    precioTarjeta: 344331,
    detalles: "Colchón de espuma de media densidad, ideal para descanso diario.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 4,
    codigo: "500107",
    nombre: "TM NOCHE 140",
    medidas: "140 x 190 x 20",
    tipo: "COLCHONES",
    subtipo: "Espuma Media Densidad",
    precioContado: 374406,
    precioTarjeta: 524168,
    detalles: "Colchón de espuma de media densidad, ideal para descanso diario.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // COLCHONES - ESPUMA ALTA DENSIDAD
  {
    id: 5,
    codigo: "500058",
    nombre: "AREZZO 080",
    medidas: "080 x 190 x 22",
    tipo: "COLCHONES",
    subtipo: "Espuma Alta Densidad",
    precioContado: 269756,
    precioTarjeta: 377658,
    detalles: "Colchón de espuma de alta densidad para mayor durabilidad y confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 6,
    codigo: "500059",
    nombre: "AREZZO 100",
    medidas: "100 x 190 x 22",
    tipo: "COLCHONES",
    subtipo: "Espuma Alta Densidad",
    precioContado: 301340,
    precioTarjeta: 421876,
    detalles: "Colchón de espuma de alta densidad para mayor durabilidad y confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 7,
    codigo: "500060",
    nombre: "AREZZO 140",
    medidas: "140 x 190 x 25",
    tipo: "COLCHONES",
    subtipo: "Espuma Alta Densidad",
    precioContado: 436041,
    precioTarjeta: 610457,
    detalles: "Colchón de espuma de alta densidad para mayor durabilidad y confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 8,
    codigo: "500007",
    nombre: "T CLAS ESP C/P 140",
    medidas: "140 x 190 x 25",
    tipo: "COLCHONES",
    subtipo: "Espuma Alta Densidad",
    precioContado: 555187,
    precioTarjeta: 777262,
    detalles: "Colchón de espuma de alta densidad con pillow top.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // COLCHONES - ESPUMA DE ALTÍSIMA DENSIDAD
  {
    id: 9,
    codigo: "500198",
    nombre: "THE BEST EURO 080",
    medidas: "080 x 190 x 28",
    tipo: "COLCHONES",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 353547,
    precioTarjeta: 494966,
    detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 10,
    codigo: "500202",
    nombre: "THE BEST EURO 100",
    medidas: "100 x 190 x 28",
    tipo: "COLCHONES",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 436041,
    precioTarjeta: 610457,
    detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 11,
    codigo: "500204",
    nombre: "THE BEST EURO 140",
    medidas: "140 x 190 x 28",
    tipo: "COLCHONES",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 671739,
    precioTarjeta: 940435,
    detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 12,
    codigo: "500206",
    nombre: "THE BEST EURO 160",
    medidas: "160 x 200 x 28",
    tipo: "COLCHONES",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 824943,
    precioTarjeta: 1154920,
    detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 13,
    codigo: "500211",
    nombre: "THE BEST EURO 180",
    medidas: "180 x 200 x 28",
    tipo: "COLCHONES",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 883867,
    precioTarjeta: 1237414,
    detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 14,
    codigo: "500205",
    nombre: "THE BEST EURO 200",
    medidas: "200 x 200 x 28",
    tipo: "COLCHONES",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 942792,
    precioTarjeta: 1319909,
    detalles: "Colchón premium de espuma de altísima densidad para máximo confort.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // COLCHONES - RESORTES TRADICIONALES
  {
    id: 15,
    codigo: "500083",
    nombre: "EXTRA 080",
    medidas: "080 x 190 x 25",
    tipo: "COLCHONES",
    subtipo: "Resortes Tradicionales",
    precioContado: 254554,
    precioTarjeta: 356376,
    detalles: "Colchón de máxima duración y firmeza con resortes de acero bicónicos.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 16,
    codigo: "500087",
    nombre: "EXTRA 100",
    medidas: "100 x 190 x 25",
    tipo: "COLCHONES",
    subtipo: "Resortes Tradicionales",
    precioContado: 308411,
    precioTarjeta: 431775,
    detalles: "Colchón de máxima duración y firmeza con resortes de acero bicónicos.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 17,
    codigo: "500077",
    nombre: "EXTRA 140",
    medidas: "140 x 190 x 25",
    tipo: "COLCHONES",
    subtipo: "Resortes Tradicionales",
    precioContado: 400922,
    precioTarjeta: 561290,
    detalles: "Colchón de máxima duración y firmeza con resortes de acero bicónicos.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 18,
    codigo: "500011",
    nombre: "T CLAS RES c/p 140",
    medidas: "140 x 190 x 30",
    tipo: "COLCHONES",
    subtipo: "Resortes Tradicionales",
    precioContado: 593841,
    precioTarjeta: 831377,
    detalles: "Colchón con tecnología de resortes clásicos y pillow top para mayor comodidad.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 19,
    codigo: "500215",
    nombre: "T CLAS RES c/p 080",
    medidas: "080 x 190 x 30",
    tipo: "COLCHONES",
    subtipo: "Resortes Tradicionales",
    precioContado: 288135,
    precioTarjeta: 403389,
    detalles: "Colchón con tecnología de resortes clásicos y pillow top para mayor comodidad.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 20,
    codigo: "500214",
    nombre: "T CLAS RES c/p 100",
    medidas: "100 x 190 x 30",
    tipo: "COLCHONES",
    subtipo: "Resortes Tradicionales",
    precioContado: 355932,
    precioTarjeta: 498305,
    detalles: "Colchón con tecnología de resortes clásicos y pillow top para mayor comodidad.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // COLCHONES - RESORTES INDIVIDUALES
  {
    id: 21,
    codigo: "500194",
    nombre: "BERLIN EURO 100",
    medidas: "100 x 190 x 30",
    tipo: "COLCHONES",
    subtipo: "Resortes Individuales",
    precioContado: 542812,
    precioTarjeta: 759937,
    detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 22,
    codigo: "500196",
    nombre: "BERLIN EURO 140",
    medidas: "140 x 190 x 30",
    tipo: "COLCHONES",
    subtipo: "Resortes Individuales",
    precioContado: 723475,
    precioTarjeta: 1012865,
    detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 23,
    codigo: "500199",
    nombre: "BERLIN EURO 160",
    medidas: "160 x 200 x 33",
    tipo: "COLCHONES",
    subtipo: "Resortes Individuales",
    precioContado: 912387,
    precioTarjeta: 1277342,
    detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 24,
    codigo: "500203",
    nombre: "BERLIN EURO 180",
    medidas: "180 x 200 x 35",
    tipo: "COLCHONES",
    subtipo: "Resortes Individuales",
    precioContado: 1014680,
    precioTarjeta: 1420552,
    detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 25,
    codigo: "500195",
    nombre: "BERLIN EURO 200",
    medidas: "200 x 200 x 35",
    tipo: "COLCHONES",
    subtipo: "Resortes Individuales",
    precioContado: 1195578,
    precioTarjeta: 1673809,
    detalles: "Colchón con resortes individuales ensacados para máximo confort y durabilidad.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // OTROS - BAJO SOMMIER
  {
    id: 26,
    codigo: "500085",
    nombre: "BOX EXTRA 080",
    medidas: "80,00",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 96395,
    precioTarjeta: 134953,
    detalles: "Base para sommier de alta calidad y durabilidad.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 27,
    codigo: "500092",
    nombre: "BOX EXTRA 100",
    medidas: "100,00",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 110501,
    precioTarjeta: 154701,
    detalles: "Base para sommier de alta calidad y durabilidad.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 28,
    codigo: "500095",
    nombre: "BOX EXTRA 140",
    medidas: "140,00",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 141065,
    precioTarjeta: 197491,
    detalles: "Base para sommier de alta calidad y durabilidad.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 29,
    codigo: "500212",
    nombre: "BOX T CLAS",
    medidas: "80 x 190 x 19",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 108033,
    precioTarjeta: 151246,
    detalles: "Base para sommier clásica con mayor altura.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 30,
    codigo: "500096",
    nombre: "BOX T CLAS 080",
    medidas: "80 x 200 x 00",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 112852,
    precioTarjeta: 157993,
    detalles: "Base para sommier clásica con mayor altura.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 31,
    codigo: "500079",
    nombre: "BOX T CLAS 140",
    medidas: "140,00",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 152821,
    precioTarjeta: 213949,
    detalles: "Base para sommier clásica con mayor altura.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 32,
    codigo: "500320",
    nombre: "BOX BERLIN 100",
    medidas: "100",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 124608,
    precioTarjeta: 174451,
    detalles: "Box sommier premium línea Berlin.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 33,
    codigo: "500460",
    nombre: "BOX BERLIN 90x2",
    medidas: "90*2",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 124608,
    precioTarjeta: 174451,
    detalles: "Box sommier premium línea Berlin.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 34,
    codigo: "500461",
    nombre: "BOX BERLIN 100x2",
    medidas: "100*2",
    tipo: "OTROS",
    subtipo: "Bajo Sommier",
    precioContado: 129310,
    precioTarjeta: 181034,
    detalles: "Box sommier premium línea Berlin.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // ALMOHADAS
  {
    id: 35,
    codigo: "500000",
    nombre: "ALMOHADA BCA",
    medidas: "70 x 11",
    tipo: "ALMOHADAS",
    subtipo: "Estándar",
    precioContado: 18974,
    precioTarjeta: 26564,
    detalles: "Almohada de calidad premium para descanso óptimo.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 36,
    codigo: "500042",
    nombre: "ALM BCA",
    medidas: "140 x 11",
    tipo: "ALMOHADAS",
    subtipo: "Estándar",
    precioContado: 29344,
    precioTarjeta: 41082,
    detalles: "Almohada de calidad premium para descanso óptimo.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 37,
    codigo: "500076",
    nombre: "ALM JUVENIL",
    medidas: "65",
    tipo: "ALMOHADAS",
    subtipo: "Estándar",
    precioContado: 15792,
    precioTarjeta: 22109,
    detalles: "Almohada de calidad premium para descanso óptimo.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 38,
    codigo: "500012",
    nombre: "ALM FIBRA",
    medidas: "AZAHAR",
    tipo: "ALMOHADAS",
    subtipo: "Estándar",
    precioContado: 14378,
    precioTarjeta: 20129,
    detalles: "Almohada de calidad premium para descanso óptimo.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 39,
    codigo: "500523",
    nombre: "ALM FIBRA PLUS",
    medidas: "",
    tipo: "ALMOHADAS",
    subtipo: "Estándar",
    precioContado: 18267,
    precioTarjeta: 25574,
    detalles: "Almohada de calidad premium para descanso óptimo.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // COLCHONES - PARA BEBÉS
  {
    id: 40,
    codigo: "500049",
    nombre: "CUNA 97x65",
    medidas: "97 x 65",
    tipo: "COLCHONES",
    subtipo: "Para Bebés",
    precioContado: 34883,
    precioTarjeta: 48836,
    detalles: "Colchón especial para cunas de bebé, hipoalergénico.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 41,
    codigo: "500047",
    nombre: "CUNA 60x120",
    medidas: "60 x 120",
    tipo: "COLCHONES",
    subtipo: "Para Bebés",
    precioContado: 36415,
    precioTarjeta: 50981,
    detalles: "Colchón especial para cunas de bebé, hipoalergénico.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 42,
    codigo: "500048",
    nombre: "CUNA 80x140",
    medidas: "80 x 140",
    tipo: "COLCHONES",
    subtipo: "Para Bebés",
    precioContado: 63403,
    precioTarjeta: 88764,
    detalles: "Colchón especial para cunas de bebé, hipoalergénico.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // RESPALDOS - ECO CUERO
  {
    id: 43,
    codigo: "500358",
    nombre: "RESPALDO COL VS 140",
    medidas: "140",
    tipo: "RESPALDOS",
    subtipo: "Eco Cuero",
    precioContado: 91304,
    precioTarjeta: 127826,
    detalles: "Respaldo acolchado en eco cuero de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 44,
    codigo: "500363",
    nombre: "RESPALDO COL VS 160",
    medidas: "160",
    tipo: "RESPALDOS",
    subtipo: "Eco Cuero",
    precioContado: 100435,
    precioTarjeta: 140609,
    detalles: "Respaldo acolchado en eco cuero de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 45,
    codigo: "500392",
    nombre: "RESPALDO COL VS 080",
    medidas: "80",
    tipo: "RESPALDOS",
    subtipo: "Eco Cuero",
    precioContado: 63913,
    precioTarjeta: 89478,
    detalles: "Respaldo acolchado en eco cuero de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 46,
    codigo: "500391",
    nombre: "RESPALDO COL VS 100",
    medidas: "100",
    tipo: "RESPALDOS",
    subtipo: "Eco Cuero",
    precioContado: 70761,
    precioTarjeta: 99065,
    detalles: "Respaldo acolchado en eco cuero de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 47,
    codigo: "500465",
    nombre: "RESPALDO COL VS 180",
    medidas: "180",
    tipo: "RESPALDOS",
    subtipo: "Eco Cuero",
    precioContado: 107283,
    precioTarjeta: 150196,
    detalles: "Respaldo acolchado en eco cuero de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 48,
    codigo: "500466",
    nombre: "RESPALDO COL VS 200",
    medidas: "200",
    tipo: "RESPALDOS",
    subtipo: "Eco Cuero",
    precioContado: 120978,
    precioTarjeta: 169369,
    detalles: "Respaldo acolchado en eco cuero de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // RESPALDOS - PANA (COL VS PANA)
  {
    id: 49,
    codigo: "500675",
    nombre: "RESPALDO COL VS PANA 140",
    medidas: "140",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 129974,
    precioTarjeta: 181964,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 50,
    codigo: "500676",
    nombre: "RESPALDO COL VS PANA 160",
    medidas: "160",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 148100,
    precioTarjeta: 207340,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 51,
    codigo: "500677",
    nombre: "RESPALDO COL VS PANA 180",
    medidas: "180",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 166229,
    precioTarjeta: 232720,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 52,
    codigo: "500674",
    nombre: "RESPALDO COL VS PANA 200",
    medidas: "200",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 184355,
    precioTarjeta: 258097,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // RESPALDOS - PANA (CANELON)
  {
    id: 53,
    codigo: "500341",
    nombre: "RESPALDO CANELON 080",
    medidas: "80",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 99494,
    precioTarjeta: 139292,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 54,
    codigo: "500342",
    nombre: "RESPALDO CANELON 100",
    medidas: "100",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 126484,
    precioTarjeta: 177078,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 55,
    codigo: "500343",
    nombre: "RESPALDO CANELON 140",
    medidas: "140",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 189726,
    precioTarjeta: 265616,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 56,
    codigo: "500344",
    nombre: "RESPALDO CANELON 160",
    medidas: "160",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 225844,
    precioTarjeta: 316182,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 57,
    codigo: "500345",
    nombre: "RESPALDO CANELON 180",
    medidas: "180",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 243970,
    precioTarjeta: 341558,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 58,
    codigo: "500346",
    nombre: "RESPALDO CANELON 200",
    medidas: "200",
    tipo: "RESPALDOS",
    subtipo: "Pana",
    precioContado: 262098,
    precioTarjeta: 366937,
    detalles: "Respaldo premium tapizado en pana de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // RESPALDOS - VERTICAL
  {
    id: 59,
    codigo: "500160",
    nombre: "RESP. CANELON VERT. 140",
    medidas: "140",
    tipo: "RESPALDOS",
    subtipo: "Vertical",
    precioContado: 208658,
    precioTarjeta: 292121,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 60,
    codigo: "500161",
    nombre: "RESP. CANELON VERT. 80",
    medidas: "80",
    tipo: "RESPALDOS",
    subtipo: "Vertical",
    precioContado: 109431,
    precioTarjeta: 153203,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 61,
    codigo: "500162",
    nombre: "RESP. CANELON VERT. 100",
    medidas: "100",
    tipo: "RESPALDOS",
    subtipo: "Vertical",
    precioContado: 139104,
    precioTarjeta: 194746,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 62,
    codigo: "500163",
    nombre: "RESP. CANELON VERT. 160",
    medidas: "160",
    tipo: "RESPALDOS",
    subtipo: "Vertical",
    precioContado: 248403,
    precioTarjeta: 347764,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 63,
    codigo: "500164",
    nombre: "RESP. CANELON VERT. 180",
    medidas: "180",
    tipo: "RESPALDOS",
    subtipo: "Vertical",
    precioContado: 268407,
    precioTarjeta: 375770,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 64,
    codigo: "500165",
    nombre: "RESP. CANELON VERT. 200",
    medidas: "200",
    tipo: "RESPALDOS",
    subtipo: "Vertical",
    precioContado: 288280,
    precioTarjeta: 403592,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // RESPALDOS - PUNTA REDONDA
  {
    id: 65,
    codigo: "500166",
    nombre: "RESP. PUNTA RED. 80",
    medidas: "80",
    tipo: "RESPALDOS",
    subtipo: "Punta Redonda",
    precioContado: 99494,
    precioTarjeta: 139292,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 66,
    codigo: "500167",
    nombre: "RESP. PUNTA RED. 100",
    medidas: "100",
    tipo: "RESPALDOS",
    subtipo: "Punta Redonda",
    precioContado: 126484,
    precioTarjeta: 177078,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 67,
    codigo: "500168",
    nombre: "RESP. PUNTA RED. 140",
    medidas: "140",
    tipo: "RESPALDOS",
    subtipo: "Punta Redonda",
    precioContado: 189726,
    precioTarjeta: 265616,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 68,
    codigo: "500169",
    nombre: "RESP. PUNTA RED. 160",
    medidas: "160",
    tipo: "RESPALDOS",
    subtipo: "Punta Redonda",
    precioContado: 225844,
    precioTarjeta: 316182,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 69,
    codigo: "500170",
    nombre: "RESP. PUNTA RED. 180",
    medidas: "180",
    tipo: "RESPALDOS",
    subtipo: "Punta Redonda",
    precioContado: 243970,
    precioTarjeta: 341558,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 70,
    codigo: "500171",
    nombre: "RESP. PUNTA RED. 200",
    medidas: "200",
    tipo: "RESPALDOS",
    subtipo: "Punta Redonda",
    precioContado: 262098,
    precioTarjeta: 366937,
    detalles: "Respaldo acolchado de alta calidad.",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // SOMMIERS GENERADOS AUTOMÁTICAMENTE
  // Sommiers 080
  {
    id: 71,
    codigo: "SOM001",
    nombre: "Sommier TM NOCHE 080",
    medidas: "080 x 190 x 20",
    tipo: "SOMMIERS",
    subtipo: "Espuma Media Densidad",
    precioContado: 315358, // TM NOCHE 080 (218963) + BOX EXTRA 080 (96395)
    precioTarjeta: 441501,
    detalles: "Sommier completo con colchón TM NOCHE 080 y 1 box Extra 080 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 72,
    codigo: "SOM002",
    nombre: "Sommier AREZZO 080",
    medidas: "080 x 190 x 22",
    tipo: "SOMMIERS",
    subtipo: "Espuma Alta Densidad",
    precioContado: 366151, // AREZZO 080 (269756) + BOX EXTRA 080 (96395)
    precioTarjeta: 512611,
    detalles: "Sommier completo con colchón AREZZO 080 y 1 box Extra 080 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 73,
    codigo: "SOM003",
    nombre: "Sommier THE BEST EURO 080",
    medidas: "080 x 190 x 28",
    tipo: "SOMMIERS",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 449942, // THE BEST EURO 080 (353547) + BOX EXTRA 080 (96395)
    precioTarjeta: 629919,
    detalles: "Sommier completo con colchón THE BEST EURO 080 y 1 box Extra 080 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 74,
    codigo: "SOM004",
    nombre: "Sommier EXTRA 080",
    medidas: "080 x 190 x 25",
    tipo: "SOMMIERS",
    subtipo: "Resortes Tradicionales",
    precioContado: 350949, // EXTRA 080 (254554) + BOX EXTRA 080 (96395)
    precioTarjeta: 491329,
    detalles: "Sommier completo con colchón EXTRA 080 y 1 box Extra 080 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 75,
    codigo: "SOM005",
    nombre: "Sommier T CLAS RES c/p 080",
    medidas: "080 x 190 x 30",
    tipo: "SOMMIERS",
    subtipo: "Resortes Tradicionales",
    precioContado: 384530, // T CLAS RES c/p 080 (288135) + BOX EXTRA 080 (96395)
    precioTarjeta: 538342,
    detalles: "Sommier completo con colchón T CLAS RES c/p 080 y 1 box Extra 080 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // Sommiers 100
  {
    id: 76,
    codigo: "SOM006",
    nombre: "Sommier TM NOCHE 100",
    medidas: "100 x 190 x 20",
    tipo: "SOMMIERS",
    subtipo: "Espuma Media Densidad",
    precioContado: 356452, // TM NOCHE 100 (245951) + BOX EXTRA 100 (110501)
    precioTarjeta: 499033,
    detalles: "Sommier completo con colchón TM NOCHE 100 y 1 box Extra 100 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 77,
    codigo: "SOM007",
    nombre: "Sommier AREZZO 100",
    medidas: "100 x 190 x 22",
    tipo: "SOMMIERS",
    subtipo: "Espuma Alta Densidad",
    precioContado: 411841, // AREZZO 100 (301340) + BOX EXTRA 100 (110501)
    precioTarjeta: 576577,
    detalles: "Sommier completo con colchón AREZZO 100 y 1 box Extra 100 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 78,
    codigo: "SOM008",
    nombre: "Sommier THE BEST EURO 100",
    medidas: "100 x 190 x 28",
    tipo: "SOMMIERS",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 546542, // THE BEST EURO 100 (436041) + BOX EXTRA 100 (110501)
    precioTarjeta: 765159,
    detalles: "Sommier completo con colchón THE BEST EURO 100 y 1 box Extra 100 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 79,
    codigo: "SOM009",
    nombre: "Sommier EXTRA 100",
    medidas: "100 x 190 x 25",
    tipo: "SOMMIERS",
    subtipo: "Resortes Tradicionales",
    precioContado: 418912, // EXTRA 100 (308411) + BOX EXTRA 100 (110501)
    precioTarjeta: 586477,
    detalles: "Sommier completo con colchón EXTRA 100 y 1 box Extra 100 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 80,
    codigo: "SOM010",
    nombre: "Sommier T CLAS RES c/p 100",
    medidas: "100 x 190 x 30",
    tipo: "SOMMIERS",
    subtipo: "Resortes Tradicionales",
    precioContado: 466433, // T CLAS RES c/p 100 (355932) + BOX EXTRA 100 (110501)
    precioTarjeta: 653006,
    detalles: "Sommier completo con colchón T CLAS RES c/p 100 y 1 box Extra 100 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 81,
    codigo: "SOM011",
    nombre: "Sommier BERLIN EURO 100",
    medidas: "100 x 190 x 30",
    tipo: "SOMMIERS",
    subtipo: "Resortes Individuales",
    precioContado: 653313, // BERLIN EURO 100 (542812) + BOX EXTRA 100 (110501)
    precioTarjeta: 914638,
    detalles: "Sommier completo con colchón BERLIN EURO 100 y 1 box Extra 100 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // Sommiers 140
  {
    id: 82,
    codigo: "SOM012",
    nombre: "Sommier TM NOCHE 140",
    medidas: "140 x 190 x 20",
    tipo: "SOMMIERS",
    subtipo: "Espuma Media Densidad",
    precioContado: 515471, // TM NOCHE 140 (374406) + BOX EXTRA 140 (141065)
    precioTarjeta: 721659,
    detalles: "Sommier completo con colchón TM NOCHE 140 y 1 box Extra 140 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 83,
    codigo: "SOM013",
    nombre: "Sommier AREZZO 140",
    medidas: "140 x 190 x 25",
    tipo: "SOMMIERS",
    subtipo: "Espuma Alta Densidad",
    precioContado: 577106, // AREZZO 140 (436041) + BOX EXTRA 140 (141065)
    precioTarjeta: 807948,
    detalles: "Sommier completo con colchón AREZZO 140 y 1 box Extra 140 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 84,
    codigo: "SOM014",
    nombre: "Sommier T CLAS ESP C/P 140",
    medidas: "140 x 190 x 25",
    tipo: "SOMMIERS",
    subtipo: "Espuma Alta Densidad",
    precioContado: 696252, // T CLAS ESP C/P 140 (555187) + BOX EXTRA 140 (141065)
    precioTarjeta: 974753,
    detalles: "Sommier completo con colchón T CLAS ESP C/P 140 y 1 box Extra 140 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 85,
    codigo: "SOM015",
    nombre: "Sommier THE BEST EURO 140",
    medidas: "140 x 190 x 28",
    tipo: "SOMMIERS",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 812804, // THE BEST EURO 140 (671739) + BOX EXTRA 140 (141065)
    precioTarjeta: 1137926,
    detalles: "Sommier completo con colchón THE BEST EURO 140 y 1 box Extra 140 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 86,
    codigo: "SOM016",
    nombre: "Sommier EXTRA 140",
    medidas: "140 x 190 x 25",
    tipo: "SOMMIERS",
    subtipo: "Resortes Tradicionales",
    precioContado: 541987, // EXTRA 140 (400922) + BOX EXTRA 140 (141065)
    precioTarjeta: 758781,
    detalles: "Sommier completo con colchón EXTRA 140 y 1 box Extra 140 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 87,
    codigo: "SOM017",
    nombre: "Sommier T CLAS RES c/p 140",
    medidas: "140 x 190 x 30",
    tipo: "SOMMIERS",
    subtipo: "Resortes Tradicionales",
    precioContado: 734906, // T CLAS RES c/p 140 (593841) + BOX EXTRA 140 (141065)
    precioTarjeta: 1028868,
    detalles: "Sommier completo con colchón T CLAS RES c/p 140 y 1 box Extra 140 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 88,
    codigo: "SOM018",
    nombre: "Sommier BERLIN EURO 140",
    medidas: "140 x 190 x 30",
    tipo: "SOMMIERS",
    subtipo: "Resortes Individuales",
    precioContado: 864540, // BERLIN EURO 140 (723475) + BOX EXTRA 140 (141065)
    precioTarjeta: 1210356,
    detalles: "Sommier completo con colchón BERLIN EURO 140 y 1 box Extra 140 incluido.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // Sommiers 160 (usan 2 boxes T CLAS 80)
  {
    id: 89,
    codigo: "SOM019",
    nombre: "Sommier THE BEST EURO 160",
    medidas: "160 x 200 x 28",
    tipo: "SOMMIERS",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 1041009, // THE BEST EURO 160 (824943) + 2 BOX T CLAS (108033 * 2)
    precioTarjeta: 1457413,
    detalles: "Sommier completo con colchón THE BEST EURO 160 y 2 boxes T Clas 80 incluidos.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 90,
    codigo: "SOM020",
    nombre: "Sommier BERLIN EURO 160",
    medidas: "160 x 200 x 33",
    tipo: "SOMMIERS",
    subtipo: "Resortes Individuales",
    precioContado: 1128453, // BERLIN EURO 160 (912387) + 2 BOX T CLAS (108033 * 2)
    precioTarjeta: 1579834,
    detalles: "Sommier completo con colchón BERLIN EURO 160 y 2 boxes T Clas 80 incluidos.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // Sommiers 180 (usan 2 boxes BERLIN 90)
  {
    id: 91,
    codigo: "SOM021",
    nombre: "Sommier THE BEST EURO 180",
    medidas: "180 x 200 x 28",
    tipo: "SOMMIERS",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 1133083, // THE BEST EURO 180 (883867) + 2 BOX BERLIN 90 (124608 * 2)
    precioTarjeta: 1586316,
    detalles: "Sommier completo con colchón THE BEST EURO 180 y 2 boxes Berlin 90 incluidos.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 92,
    codigo: "SOM022",
    nombre: "Sommier BERLIN EURO 180",
    medidas: "180 x 200 x 35",
    tipo: "SOMMIERS",
    subtipo: "Resortes Individuales",
    precioContado: 1263896, // BERLIN EURO 180 (1014680) + 2 BOX BERLIN 90 (124608 * 2)
    precioTarjeta: 1769454,
    detalles: "Sommier completo con colchón BERLIN EURO 180 y 2 boxes Berlin 90 incluidos.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },

  // Sommiers 200 (usan 2 boxes BERLIN 100)
  {
    id: 93,
    codigo: "SOM023",
    nombre: "Sommier THE BEST EURO 200",
    medidas: "200 x 200 x 28",
    tipo: "SOMMIERS",
    subtipo: "Espuma de Altísima Densidad",
    precioContado: 1201412, // THE BEST EURO 200 (942792) + 2 BOX BERLIN 100 (129310 * 2)
    precioTarjeta: 1681977,
    detalles: "Sommier completo con colchón THE BEST EURO 200 y 2 boxes Berlin 100 incluidos.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  },
  {
    id: 94,
    codigo: "SOM024",
    nombre: "Sommier BERLIN EURO 200",
    medidas: "200 x 200 x 35",
    tipo: "SOMMIERS",
    subtipo: "Resortes Individuales",
    precioContado: 1454198, // BERLIN EURO 200 (1195578) + 2 BOX BERLIN 100 (129310 * 2)
    precioTarjeta: 2035877,
    detalles: "Sommier completo con colchón BERLIN EURO 200 y 2 boxes Berlin 100 incluidos.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    marca: "Reposar"
  }
];