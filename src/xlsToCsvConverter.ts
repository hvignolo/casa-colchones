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

        // Find header row (usually the first one, but we could search for it)
        // For simplicity, we assume row 0 is headers
        const headers = data[0].map((h: any) => String(h));

        // Map columns
        const codeIdx = findColumnIndex(headers, FIELD_MAPPINGS.codigo);
        const priceIdx = findColumnIndex(headers, FIELD_MAPPINGS.precio);
        const nameIdx = findColumnIndex(headers, FIELD_MAPPINGS.nombre);
        const sizeIdx = findColumnIndex(headers, FIELD_MAPPINGS.medida);
        const statusIdx = findColumnIndex(headers, FIELD_MAPPINGS.estado);

        // Validate required columns
        if (codeIdx === -1 || priceIdx === -1) {
            return {
                success: false,
                error: "No se encontraron las columnas obligatorias: Código y Precio."
            };
        }

        // Process rows
        // Start from index 1 (skip headers)
        let validProductsCount = 0;
        const csvRows = [];
        const csvHeader = "codigo,nombre,medida,precio,estado";
        csvRows.push(csvHeader);

        for (let i = 1; i < data.length; i++) {
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
