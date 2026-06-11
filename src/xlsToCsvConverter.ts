// XLS/XLSX to CSV Converter Module
// Converts Excel price lists from suppliers to CSV format for price updates

import * as XLSX from 'xlsx';
import { XML_ERROR_MESSAGES } from './constants';

// We can reuse the same error constants or add new ones if needed.
// For now we will adapt the error structure.

// Interfaces shared or similar to XML converter
export interface ExcelConversionResult {
    success: boolean;
    csvContent?: string;
    productsCount?: number;
    error?: string;
}

// Configuración de mapeo de campos con nombres alternativos
const FIELD_MAPPINGS = {
    codigo: ["codigo", "code", "id", "sku", "cod", "código"],
    nombre: ["nombre", "name", "producto", "product", "descripcion", "descripción"],
    medida: ["medida", "medidas", "size", "dimensions", "dimension"],
    precio: ["precio", "price", "valor", "value", "cost"],
    estado: ["estado", "status", "state", "active"],
};

/**
 * Validates that a file has .xls or .xlsx extension (case-insensitive)
 * @param fileName - Name of the file to validate
 * @returns true if file has correct extension
 */
export function validateExcelFileExtension(fileName: string): boolean {
    if (!fileName || typeof fileName !== 'string') {
        return false;
    }

    const lowerFileName = fileName.toLowerCase();
    return lowerFileName.endsWith('.xls') || lowerFileName.endsWith('.xlsx');
}

/**
 * Normalizes a string to compare it with field mappings
 * Helps matching "Código" with "codigo", etc.
 */
function normalizeHeader(header: string): string {
    if (!header) return "";
    return header.toString().toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
}

/**
 * Finds the index of a column based on possible names
 */
function findColumnIndex(headers: string[], possibleNames: string[]): number {
    const normalizedHeaders = headers.map(normalizeHeader);
    const normalizedNames = possibleNames.map(normalizeHeader);

    return normalizedHeaders.findIndex(header => normalizedNames.includes(header));
}

/**
 * Escapes CSV value if it contains special characters
 */
function escapeCsvValue(value: any): string {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

/**
 * Parses buffer content (from file read) to CSV
 * @param arrayBuffer - The file content as ArrayBuffer
 */
export function convertXlsToCsv(arrayBuffer: ArrayBuffer): ExcelConversionResult {
    try {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Assume the first sheet is the one we want
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
            return { success: false, error: "El archivo Excel no contiene hojas de cálculo." };
        }

        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON array of arrays (first row is headers)
        const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!data || data.length === 0) {
            return { success: false, error: XML_ERROR_MESSAGES.EMPTY_FILE };
        }

        // Intentar detectar una fila de encabezado (archivos con "codigo", "precio", etc.)
        const headers = data[0].map((h: any) => String(h));
        const headerCodeIdx = findColumnIndex(headers, FIELD_MAPPINGS.codigo);
        const headerPriceIdx = findColumnIndex(headers, FIELD_MAPPINGS.precio);

        let codeIdx: number, priceIdx: number, nameIdx: number, sizeIdx: number, statusIdx: number;
        let startRow: number;

        if (headerCodeIdx !== -1 && headerPriceIdx !== -1) {
            // Archivo CON encabezado: usar las columnas mapeadas y saltar la fila 0.
            codeIdx = headerCodeIdx;
            priceIdx = headerPriceIdx;
            nameIdx = findColumnIndex(headers, FIELD_MAPPINGS.nombre);
            sizeIdx = findColumnIndex(headers, FIELD_MAPPINGS.medida);
            statusIdx = findColumnIndex(headers, FIELD_MAPPINGS.estado);
            startRow = 1;
        } else {
            // Archivo SIN encabezado (lista mayorista del proveedor): layout fijo por
            // posición [codigo, nombre, medida, precio, estado]. Procesamos todas las
            // filas; las de título/vacías se descartan porque no tienen código o precio.
            codeIdx = 0;
            nameIdx = 1;
            sizeIdx = 2;
            priceIdx = 3;
            statusIdx = 4;
            startRow = 0;
        }

        // Process rows
        let validProductsCount = 0;
        const csvRows = [];
        const csvHeader = "codigo,nombre,medida,precio,estado";
        csvRows.push(csvHeader);

        for (let i = startRow; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length === 0) continue;

            const codeRaw = row[codeIdx];
            const priceRaw = row[priceIdx];

            // Validate required fields
            if (codeRaw === undefined || codeRaw === null || String(codeRaw).trim() === '') continue;
            if (priceRaw === undefined || priceRaw === null) continue;

            // Price must be a number or parseable string
            let price: number;
            if (typeof priceRaw === 'number') {
                price = priceRaw;
            } else {
                // Ensure we handle thousand separators (dots) and decimal separators (commas)
                // 1. Remove dots (thousand separators)
                // 2. Replace comma with dot (decimal separator)
                const cleanStr = String(priceRaw).replace(/\./g, '').replace(',', '.');
                price = parseFloat(cleanStr);
            }

            if (isNaN(price)) continue;

            // Extract other fields
            const name = nameIdx !== -1 ? (row[nameIdx] || "") : "";
            const measure = sizeIdx !== -1 ? (row[sizeIdx] || "") : "";
            const status = statusIdx !== -1 ? (row[statusIdx] || "activo") : "activo";

            // Format for CSV
            // Ensure code is treated as string
            const codeStr = String(codeRaw).trim();
            const priceStr = price.toFixed(2);

            csvRows.push(`${escapeCsvValue(codeStr)},${escapeCsvValue(name)},${escapeCsvValue(measure)},${priceStr},${escapeCsvValue(status)}`);
            validProductsCount++;
        }

        if (validProductsCount === 0) {
            return { success: false, error: XML_ERROR_MESSAGES.NO_PRODUCTS_FOUND };
        }

        return {
            success: true,
            csvContent: csvRows.join('\n'),
            productsCount: validProductsCount
        };

    } catch (error) {
        console.error("Error parsing Excel:", error);
        return {
            success: false,
            error: "Error al procesar el archivo Excel. Asegúrate de que sea un archivo válido."
        };
    }
}

/**
 * Convierte un valor de precio (número o string) a número limpio.
 * Acepta números directos (lo ideal) y strings " $ 92.791,65 " / " $ 92,791.65 ".
 */
function parsePriceValue(value: any): number {
    if (value === null || value === undefined) return NaN;
    if (typeof value === 'number') return value;
    let s = String(value).replace(/[^0-9.,-]/g, '');
    if (!s) return NaN;
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    if (lastComma > -1 && lastDot > -1) {
        // El último separador es el decimal.
        s = lastComma > lastDot
            ? s.replace(/\./g, '').replace(',', '.')   // AR: 92.791,65
            : s.replace(/,/g, '');                      // US: 92,791.65
    } else if (lastComma > -1) {
        s = s.replace(',', '.');                        // 92791,65
    }
    return parseFloat(s);
}

/**
 * Lee un archivo Excel (.xls/.xlsx) de lista mayorista y devuelve directamente un
 * mapa código -> precio de COSTO, SIN pasar por CSV. Toma el valor numérico real de
 * la celda (raw), que es mucho más robusto que parsear strings con $ y separadores.
 *
 * Layout del proveedor (sin encabezado): [codigo, nombre, medida, precio, estado].
 * Si el archivo trae un encabezado con nombres reconocibles, se usan esas columnas.
 * Los sommiers (códigos no numéricos) no vienen en la lista: se recalculan aparte.
 */
export function parseXlsPriceMap(arrayBuffer: ArrayBuffer): { priceMap: Record<string, number>; count: number } {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return { priceMap: {}, count: 0 };

    const worksheet = workbook.Sheets[sheetName];
    const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, blankrows: false });
    if (!data || data.length === 0) return { priceMap: {}, count: 0 };

    // Detectar encabezado; si no hay, usar el layout fijo por posición.
    const headers = (data[0] || []).map((h: any) => String(h));
    const headerCodeIdx = findColumnIndex(headers, FIELD_MAPPINGS.codigo);
    const headerPriceIdx = findColumnIndex(headers, FIELD_MAPPINGS.precio);

    let codeIdx: number, priceIdx: number, startRow: number;
    if (headerCodeIdx !== -1 && headerPriceIdx !== -1) {
        codeIdx = headerCodeIdx;
        priceIdx = headerPriceIdx;
        startRow = 1;
    } else {
        codeIdx = 0;
        priceIdx = 3;
        startRow = 0;
    }

    const priceMap: Record<string, number> = {};
    for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const codeRaw = row[codeIdx];
        const priceRaw = row[priceIdx];
        if (codeRaw === undefined || codeRaw === null || String(codeRaw).trim() === '') continue;
        if (priceRaw === undefined || priceRaw === null) continue;

        const price = parsePriceValue(priceRaw);
        if (isNaN(price) || price <= 0) continue;

        // Normalizar código numérico (500040 / "500040.0" -> "500040").
        let code = String(codeRaw).trim();
        if (!isNaN(Number(code))) code = parseInt(code, 10).toString();

        // Solo códigos de producto numéricos (descarta títulos y sommiers).
        if (!/^\d+$/.test(code)) continue;

        priceMap[code] = price;
    }

    return { priceMap, count: Object.keys(priceMap).length };
}
