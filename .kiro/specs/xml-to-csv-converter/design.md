# Design Document

## Overview

Este documento describe el diseño técnico para agregar funcionalidad de conversión XML a CSV en el sistema de Casa Colchones. La funcionalidad permitirá a los administradores subir archivos XML de listas de precios de proveedores y convertirlos automáticamente a formato CSV para actualizar precios de productos existentes.

La solución se integrará en el componente `SettingsModal` existente, específicamente en la vista "prices", agregando una nueva opción de importación junto a la funcionalidad CSV existente.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SettingsModal                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Prices View (case "prices")                  │  │
│  │  ┌─────────────────┐    ┌─────────────────────────┐  │  │
│  │  │  CSV Import     │    │  XML Import (NEW)       │  │  │
│  │  │  (existing)     │    │  - File input           │  │  │
│  │  │                 │    │  - XML parser           │  │  │
│  │  └─────────────────┘    │  - CSV converter        │  │  │
│  │                         └─────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│                    onImportPriceList()                       │
│                    (AdminDashboard)                          │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Price Update Logic  │
                    │  (existing)          │
                    └──────────────────────┘
```

### Component Structure

1. **SettingsModal** (modificado)
   - Agregar input para archivos XML en la vista "prices"
   - Agregar handler para procesar archivos XML
   - Mantener la interfaz consistente con el input CSV existente

2. **xmlToCsvConverter** (nuevo módulo)
   - Función para parsear XML
   - Función para mapear campos XML a formato CSV
   - Función para generar string CSV
   - Manejo de errores y validación

3. **AdminDashboard** (modificado mínimamente)
   - Agregar handler `handleImportXmlPriceList` que llame al converter
   - Pasar el nuevo handler como prop a SettingsModal
   - Reutilizar la lógica existente de actualización de precios

## Components and Interfaces

### New Module: xmlToCsvConverter.ts

```typescript
// Interfaz para el resultado del parsing XML
export interface ParsedXmlProduct {
  codigo: string;
  nombre: string;
  medida: string;
  precio: number;
  estado?: string;
}

// Interfaz para el resultado de la conversión
export interface XmlConversionResult {
  success: boolean;
  csvContent?: string;
  productsCount?: number;
  error?: string;
}

// Interfaz para configuración de mapeo de campos
export interface XmlFieldMapping {
  codigo: string[];      // Posibles nombres: ["codigo", "code", "id", "sku"]
  nombre: string[];      // Posibles nombres: ["nombre", "name", "producto", "product"]
  medida: string[];      // Posibles nombres: ["medida", "medidas", "size", "dimensions"]
  precio: string[];      // Posibles nombres: ["precio", "price", "valor", "value"]
  estado: string[];      // Posibles nombres: ["estado", "status", "state"]
}

// Función principal de conversión
export function convertXmlToCsv(xmlContent: string): XmlConversionResult;

// Función para parsear XML a objetos
export function parseXmlToProducts(xmlContent: string): ParsedXmlProduct[];

// Función para generar CSV desde productos parseados
export function generateCsvFromProducts(products: ParsedXmlProduct[]): string;

// Función para mapear campos con nombres alternativos
export function mapXmlField(
  element: Element, 
  fieldNames: string[]
): string | null;
```

### Modified Component: SettingsModal.tsx

```typescript
interface SettingsModalProps {
  // ... props existentes
  onImportPriceList: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImportXmlPriceList: (event: React.ChangeEvent<HTMLInputElement>) => void; // NUEVO
  // ... resto de props
}
```

### Modified Component: AdminDashboard.tsx

```typescript
// Nuevo handler para importar XML
const handleImportXmlPriceList = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const xmlContent = e.target?.result as string;
      
      // Convertir XML a CSV
      const result = convertXmlToCsv(xmlContent);
      
      if (!result.success) {
        showToastMessage(result.error || ERROR_MESSAGES.INVALID_XML_FILE);
        return;
      }

      // Procesar el CSV generado usando la lógica existente
      const csvContent = result.csvContent!;
      await processCSVContent(csvContent);
      
      showToastMessage(
        `${SUCCESS_MESSAGES.PRICES_UPDATED} (${result.productsCount} productos procesados desde XML)`
      );
    } catch (error) {
      console.error(error);
      showToastMessage(ERROR_MESSAGES.INVALID_XML_FILE);
    }
  };
  reader.readAsText(file);
};

// Extraer lógica de procesamiento CSV a función reutilizable
const processCSVContent = async (csvContent: string) => {
  const lines = csvContent.split(/\r?\n/).filter((ln) => ln.trim());
  const priceMap: Record<string, number> = {};
  
  // ... lógica existente de importPriceList
};
```

## Data Models

### XML Structure Examples

El sistema debe soportar múltiples estructuras XML comunes:

**Estructura 1: Lista plana**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<productos>
  <producto>
    <codigo>12345</codigo>
    <nombre>Colchón Premium</nombre>
    <medida>2.00 x 1.40</medida>
    <precio>45000.50</precio>
    <estado>activo</estado>
  </producto>
  <producto>
    <codigo>12346</codigo>
    <nombre>Sommier Base</nombre>
    <medida>2.00 x 1.40</medida>
    <precio>32000.00</precio>
    <estado>activo</estado>
  </producto>
</productos>
```

**Estructura 2: Con atributos**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<lista>
  <item code="12345" price="45000.50">
    <name>Colchón Premium</name>
    <size>2.00 x 1.40</size>
    <status>activo</status>
  </item>
</lista>
```

**Estructura 3: Nombres en inglés**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <id>12345</id>
    <name>Colchón Premium</name>
    <dimensions>2.00 x 1.40</dimensions>
    <value>45000.50</value>
  </product>
</products>
```

### CSV Output Format

El CSV generado debe seguir el formato esperado por la función `importPriceList` existente:

```csv
codigo,nombre,medida,precio,estado
12345,Colchón Premium,2.00 x 1.40,45000.50,activo
12346,Sommier Base,2.00 x 1.40,32000.00,activo
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: XML file extension validation

*For any* file name, the validation function should return true only when the file has a .xml extension (case-insensitive) and false for all other extensions
**Validates: Requirements 1.2**

### Property 2: XML parsing extracts all valid products

*For any* valid XML document containing multiple product entries with required fields (código, precio), the parser should extract all valid products and return them in a structured array
**Validates: Requirements 2.5**

### Property 3: Field mapping handles alternative names

*For any* XML product element containing a field with an alternative name from the mapping list (e.g., "code"/"codigo", "price"/"precio"), the mapping function should correctly identify and extract the value
**Validates: Requirements 2.2**

### Property 4: Data integrity during conversion

*For any* set of parsed products containing special characters, accents, decimal prices, and whitespace, the generated CSV should preserve all characters correctly, maintain numeric precision to 2 decimal places, and handle whitespace appropriately
**Validates: Requirements 4.1, 4.2, 4.3**

### Property 5: Conversion round-trip consistency

*For any* valid XML with products, converting to CSV and then parsing that CSV with the existing CSV processor should yield products with the same códigos and precios as extracted from the original XML
**Validates: Requirements 4.5, 1.5**

### Property 6: Specific error messages for failures

*For any* XML file that fails parsing or validation, the system should return an error message that specifically identifies the failure type (malformed XML, missing fields, encoding error, etc.) rather than a generic error
**Validates: Requirements 3.3, 3.5**

### Property 7: Graceful handling of invalid products

*For any* XML document containing a mix of valid and invalid product entries (missing required fields), the system should extract all valid products and skip invalid ones without failing the entire operation
**Validates: Requirements 4.4**

### Property 8: Success feedback includes product count

*For any* successful XML to CSV conversion, the system should return a result that includes the count of products successfully processed
**Validates: Requirements 3.2, 3.4**

## Error Handling

### Error Types and Messages

```typescript
export const XML_ERROR_MESSAGES = {
  INVALID_FILE_TYPE: "El archivo debe tener extensión .xml",
  PARSE_ERROR: "Error al parsear el archivo XML. Verifica que el formato sea válido",
  NO_PRODUCTS_FOUND: "No se encontraron productos válidos en el archivo XML",
  MISSING_REQUIRED_FIELDS: "Algunos productos no tienen los campos requeridos (código y precio)",
  ENCODING_ERROR: "Error de codificación. Asegúrate de que el archivo use UTF-8",
  EMPTY_FILE: "El archivo XML está vacío",
  MALFORMED_XML: "El XML está mal formado. Verifica que todas las etiquetas estén cerradas correctamente",
};
```

### Error Handling Strategy

1. **File Validation**
   - Verificar extensión .xml antes de leer
   - Verificar que el archivo no esté vacío
   - Mostrar error específico si falla

2. **XML Parsing**
   - Usar try-catch alrededor del DOMParser
   - Verificar si el parser retorna errores
   - Manejar errores de codificación

3. **Data Extraction**
   - Validar que existan elementos de producto
   - Verificar campos requeridos (código, precio)
   - Continuar con productos válidos si algunos fallan

4. **CSV Generation**
   - Validar que haya al menos un producto válido
   - Escapar caracteres especiales en CSV
   - Preservar encoding UTF-8

5. **User Feedback**
   - Mostrar progreso durante conversión
   - Indicar número de productos procesados
   - Mostrar número de productos omitidos si aplica

## Testing Strategy

### Unit Testing

Se utilizará Jest para las pruebas unitarias. Los tests cubrirán:

1. **XML Parsing Tests**
   - Test: Parsear XML con estructura plana
   - Test: Parsear XML con atributos
   - Test: Parsear XML con nombres en inglés
   - Test: Manejar XML vacío
   - Test: Manejar XML mal formado

2. **Field Mapping Tests**
   - Test: Mapear campo "codigo" correctamente
   - Test: Mapear campo "code" a "codigo"
   - Test: Mapear campo "precio" correctamente
   - Test: Mapear campo "price" a "precio"
   - Test: Retornar null para campos no encontrados

3. **CSV Generation Tests**
   - Test: Generar CSV con un producto
   - Test: Generar CSV con múltiples productos
   - Test: Preservar acentos y caracteres especiales
   - Test: Mantener precisión decimal en precios
   - Test: Escapar comas en valores

4. **Integration Tests**
   - Test: Conversión completa XML a CSV
   - Test: Procesar CSV generado con lógica existente
   - Test: Actualizar precios desde XML

### Property-Based Testing

Se utilizará fast-check para las pruebas basadas en propiedades. La librería fast-check es la opción estándar para property-based testing en TypeScript/JavaScript.

Cada test de propiedad se configurará para ejecutar un mínimo de 100 iteraciones para asegurar cobertura adecuada.

**Property Test 1: XML file extension validation**
```typescript
// Feature: xml-to-csv-converter, Property 1: XML file extension validation
// Validates: Requirements 1.2
```

**Property Test 2: XML parsing extracts all valid products**
```typescript
// Feature: xml-to-csv-converter, Property 2: XML parsing extracts all valid products
// Validates: Requirements 2.5
```

**Property Test 3: Field mapping handles alternative names**
```typescript
// Feature: xml-to-csv-converter, Property 3: Field mapping handles alternative names
// Validates: Requirements 2.2
```

**Property Test 4: Data integrity during conversion**
```typescript
// Feature: xml-to-csv-converter, Property 4: Data integrity during conversion
// Validates: Requirements 4.1, 4.2, 4.3
```

**Property Test 5: Conversion round-trip consistency**
```typescript
// Feature: xml-to-csv-converter, Property 5: Conversion round-trip consistency
// Validates: Requirements 4.5, 1.5
```

**Property Test 6: Specific error messages for failures**
```typescript
// Feature: xml-to-csv-converter, Property 6: Specific error messages for failures
// Validates: Requirements 3.3, 3.5
```

**Property Test 7: Graceful handling of invalid products**
```typescript
// Feature: xml-to-csv-converter, Property 7: Graceful handling of invalid products
// Validates: Requirements 4.4
```

**Property Test 8: Success feedback includes product count**
```typescript
// Feature: xml-to-csv-converter, Property 8: Success feedback includes product count
// Validates: Requirements 3.2, 3.4
```

## Implementation Notes

### XML Parsing Approach

Usaremos el `DOMParser` nativo del navegador para parsear XML:

```typescript
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

// Verificar errores de parsing
const parserError = xmlDoc.querySelector("parsererror");
if (parserError) {
  throw new Error("XML mal formado");
}
```

### Field Mapping Strategy

Implementaremos un sistema de mapeo flexible que busque múltiples nombres posibles:

```typescript
const FIELD_MAPPINGS: XmlFieldMapping = {
  codigo: ["codigo", "code", "id", "sku", "cod"],
  nombre: ["nombre", "name", "producto", "product", "descripcion"],
  medida: ["medida", "medidas", "size", "dimensions", "dimension"],
  precio: ["precio", "price", "valor", "value", "cost"],
  estado: ["estado", "status", "state", "active"],
};
```

### CSV Escaping

Para asegurar compatibilidad CSV, escaparemos valores que contengan comas o comillas:

```typescript
function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
```

### Progress Indication

Para archivos grandes, mostraremos progreso:

```typescript
// En el handler de AdminDashboard
showToastMessage("Procesando archivo XML...");

// Después de conversión exitosa
showToastMessage(
  `✓ ${result.productsCount} productos procesados desde XML`
);
```

## Security Considerations

1. **File Size Limits**: Limitar tamaño de archivo XML a 5MB para prevenir problemas de memoria
2. **XML Injection**: El DOMParser maneja automáticamente entidades XML peligrosas
3. **XSS Prevention**: No renderizar contenido XML directamente en el DOM
4. **Input Validation**: Validar que los valores numéricos sean números válidos antes de procesar

## Performance Considerations

1. **Streaming**: Para archivos muy grandes, considerar procesamiento por chunks
2. **Memory**: Liberar referencias a objetos grandes después de procesamiento
3. **UI Responsiveness**: Usar setTimeout para permitir que el UI se actualice durante procesamiento largo

## Future Enhancements

1. **Excel Support**: Agregar soporte para archivos .xlsx usando una librería como xlsx
2. **Custom Mappings**: Permitir al usuario configurar mapeos de campos personalizados
3. **Preview**: Mostrar preview de los datos antes de importar
4. **Batch Processing**: Permitir subir múltiples archivos a la vez
5. **Validation Rules**: Agregar reglas de validación configurables para precios y códigos
