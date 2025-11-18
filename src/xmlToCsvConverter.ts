// XML to CSV Converter Module
// Converts XML price lists from suppliers to CSV format for price updates

import { XML_ERROR_MESSAGES } from './constants';

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
  codigo: string[];
  nombre: string[];
  medida: string[];
  precio: string[];
  estado: string[];
}

// Configuración de mapeo de campos con nombres alternativos
const FIELD_MAPPINGS: XmlFieldMapping = {
  codigo: ["codigo", "code", "id", "sku", "cod"],
  nombre: ["nombre", "name", "producto", "product", "descripcion"],
  medida: ["medida", "medidas", "size", "dimensions", "dimension"],
  precio: ["precio", "price", "valor", "value", "cost"],
  estado: ["estado", "status", "state", "active"],
};

/**
 * Validates that a file has .xml extension (case-insensitive)
 * @param fileName - Name of the file to validate
 * @returns true if file has .xml extension, false otherwise
 */
export function validateXmlFileExtension(fileName: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }
  
  const lowerFileName = fileName.toLowerCase();
  return lowerFileName.endsWith('.xml');
}

/**
 * Maps XML field to value by checking multiple possible field names
 * Supports both element text content and attributes
 * @param element - XML element to search
 * @param fieldNames - Array of possible field names
 * @returns Field value or null if not found
 */
export function mapXmlField(
  element: Element,
  fieldNames: string[]
): string | null {
  // Check attributes first
  for (const fieldName of fieldNames) {
    const attrValue = element.getAttribute(fieldName);
    if (attrValue !== null && attrValue.trim() !== "") {
      return attrValue.trim();
    }
  }

  // Check child elements
  for (const fieldName of fieldNames) {
    const childElement = element.querySelector(fieldName);
    if (childElement && childElement.textContent) {
      const content = childElement.textContent.trim();
      if (content !== "") {
        return content;
      }
    }
  }

  return null;
}

/**
 * Validates that a product has required fields (código and precio)
 * @param codigo - Product code
 * @param precioStr - Product price as string
 * @returns true if both fields are valid, false otherwise
 */
export function validateRequiredFields(codigo: string | null, precioStr: string | null): boolean {
  // Check that código exists and is not empty
  if (!codigo || codigo.trim() === '') {
    return false;
  }
  
  // Check that precio exists and is not empty
  if (!precioStr || precioStr.trim() === '') {
    return false;
  }
  
  // Check that precio is a valid number
  const precio = parseFloat(precioStr);
  if (isNaN(precio) || precio < 0) {
    return false;
  }
  
  return true;
}

/**
 * Parses XML content and extracts products
 * Handles multiple XML structures (flat lists, attributes, hierarchical)
 * Gracefully skips products with missing required fields
 * @param xmlContent - XML string content
 * @returns Array of parsed products
 */
export function parseXmlToProducts(xmlContent: string): ParsedXmlProduct[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  // Check for parser errors
  const parserError = xmlDoc.querySelector("parsererror");
  if (parserError) {
    throw new Error(XML_ERROR_MESSAGES.MALFORMED_XML);
  }

  const products: ParsedXmlProduct[] = [];

  // Try to find product elements with various possible names
  const possibleProductTags = [
    "producto",
    "product",
    "item",
    "articulo",
    "article",
  ];

  let productElements: Element[] = [];
  for (const tagName of possibleProductTags) {
    const elements = Array.from(xmlDoc.getElementsByTagName(tagName));
    if (elements.length > 0) {
      productElements = elements;
      break;
    }
  }

  // Process each product element
  for (const element of productElements) {
    const codigo = mapXmlField(element, FIELD_MAPPINGS.codigo);
    const precioStr = mapXmlField(element, FIELD_MAPPINGS.precio);

    // Validate required fields - skip products that don't have them
    if (!validateRequiredFields(codigo, precioStr)) {
      // Continue processing remaining valid products
      continue;
    }

    const precio = parseFloat(precioStr!);

    const nombre = mapXmlField(element, FIELD_MAPPINGS.nombre) || "";
    const medida = mapXmlField(element, FIELD_MAPPINGS.medida) || "";
    const estado = mapXmlField(element, FIELD_MAPPINGS.estado) || undefined;

    products.push({
      codigo: codigo!,
      nombre,
      medida,
      precio,
      estado,
    });
  }

  return products;
}

/**
 * Escapes CSV value if it contains special characters
 * @param value - Value to escape
 * @returns Escaped value
 */
function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Generates CSV string from parsed products
 * Preserves UTF-8 encoding for accents and special characters
 * Maintains decimal precision for prices
 * @param products - Array of parsed products
 * @returns CSV string with header
 */
export function generateCsvFromProducts(products: ParsedXmlProduct[]): string {
  const header = "codigo,nombre,medida,precio,estado";
  const rows = products.map((product) => {
    const codigo = escapeCsvValue(product.codigo);
    const nombre = escapeCsvValue(product.nombre);
    const medida = escapeCsvValue(product.medida);
    // Maintain decimal precision for prices
    const precio = product.precio.toFixed(2);
    const estado = escapeCsvValue(product.estado || "activo");

    return `${codigo},${nombre},${medida},${precio},${estado}`;
  });

  return [header, ...rows].join("\n");
}

/**
 * Main conversion function - converts XML to CSV
 * Handles validation, parsing, and error reporting with specific error messages
 * @param xmlContent - XML string content
 * @returns Conversion result with success status, CSV content, and product count
 */
export function convertXmlToCsv(xmlContent: string): XmlConversionResult {
  try {
    // Validate input - check for empty file
    if (!xmlContent || xmlContent.trim() === "") {
      return {
        success: false,
        error: XML_ERROR_MESSAGES.EMPTY_FILE,
      };
    }

    // Parse XML to products
    const products = parseXmlToProducts(xmlContent);

    // Check if any products were found
    if (products.length === 0) {
      return {
        success: false,
        error: XML_ERROR_MESSAGES.NO_PRODUCTS_FOUND,
      };
    }

    // Generate CSV
    const csvContent = generateCsvFromProducts(products);

    return {
      success: true,
      csvContent,
      productsCount: products.length,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : XML_ERROR_MESSAGES.PARSE_ERROR;

    // Return specific error messages based on error type
    if (errorMessage.includes(XML_ERROR_MESSAGES.MALFORMED_XML)) {
      return {
        success: false,
        error: XML_ERROR_MESSAGES.MALFORMED_XML,
      };
    }

    if (errorMessage.includes("encoding") || errorMessage.includes("codificación")) {
      return {
        success: false,
        error: XML_ERROR_MESSAGES.ENCODING_ERROR,
      };
    }

    return {
      success: false,
      error: `${XML_ERROR_MESSAGES.PARSE_ERROR}: ${errorMessage}`,
    };
  }
}
