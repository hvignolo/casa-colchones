
import {
    validateExcelFileExtension,
    convertXlsToCsv,
} from './xlsToCsvConverter';
import * as XLSX from 'xlsx';
import { XML_ERROR_MESSAGES } from './constants';

// Mock xlsx module
jest.mock('xlsx', () => ({
    read: jest.fn(),
    utils: {
        sheet_to_json: jest.fn(),
    },
}));

describe('xlsToCsvConverter', () => {
    describe('validateExcelFileExtension', () => {
        it('should return true for valid extension', () => {
            expect(validateExcelFileExtension('file.xls')).toBe(true);
            expect(validateExcelFileExtension('file.xlsx')).toBe(true);
            expect(validateExcelFileExtension('file.XLS')).toBe(true);
        });

        it('should return false for invalid extensions', () => {
            expect(validateExcelFileExtension('file.txt')).toBe(false);
            expect(validateExcelFileExtension('file.csv')).toBe(false);
            expect(validateExcelFileExtension('file')).toBe(false);
        });

        it('should return false for empty or invalid input', () => {
            expect(validateExcelFileExtension('')).toBe(false);
            expect(validateExcelFileExtension(null as any)).toBe(false);
        });
    });

    describe('convertXlsToCsv', () => {
        const mockRead = XLSX.read as jest.Mock;
        const mockSheetToJson = XLSX.utils.sheet_to_json as jest.Mock;

        beforeEach(() => {
            jest.clearAllMocks();
            // Setup default mock return for read
            mockRead.mockReturnValue({
                SheetNames: ['Sheet1'],
                Sheets: { 'Sheet1': {} }
            });
        });

        it('should return error if no sheets found', () => {
            mockRead.mockReturnValue({
                SheetNames: [],
                Sheets: {}
            });

            const result = convertXlsToCsv(new ArrayBuffer(0));
            expect(result.success).toBe(false);
            expect(result.error).toContain('no contiene hojas de cálculo');
        });

        it('should return error for empty data', () => {
            mockSheetToJson.mockReturnValue([]);

            const result = convertXlsToCsv(new ArrayBuffer(8));
            expect(result.success).toBe(false);
            expect(result.error).toBe(XML_ERROR_MESSAGES.EMPTY_FILE);
        });

        it('should return error if required columns are missing', () => {
            // Mock data with missing columns
            mockSheetToJson.mockReturnValue([
                ['nombre', 'otro'], // Headers
                ['Producto 1', 'algo']
            ]);

            const result = convertXlsToCsv(new ArrayBuffer(8));
            expect(result.success).toBe(false);
            expect(result.error).toContain('No se encontraron las columnas obligatorias');
        });

        it('should successfully convert valid data', () => {
            // Mock valid data
            const mockData = [
                ['Codigo', 'Nombre', 'Precio', 'Medida', 'Estado'],
                ['123', 'Prod 1', 100.50, '1x1', 'activo'],
                ['456', 'Prod 2', '200,00', null, 'inactivo'] // String price with comma
            ];
            mockSheetToJson.mockReturnValue(mockData);

            const result = convertXlsToCsv(new ArrayBuffer(8));

            expect(result.success).toBe(true);
            expect(result.productsCount).toBe(2);
            expect(result.csvContent).toContain('123,Prod 1,1x1,100.50,activo');
            // Updated expectation to handle comma to dot conversion outcome effectively
            expect(result.csvContent).toContain('456,Prod 2,,200.00,inactivo');
        });

        it('should skip invalid rows', () => {
            const mockData = [
                ['Codigo', 'Precio'],
                [null, 100], // Missing code
                ['123', 'invalid'], // Invalid price
                ['456', 200] // Valid
            ];
            mockSheetToJson.mockReturnValue(mockData);

            const result = convertXlsToCsv(new ArrayBuffer(8));

            expect(result.success).toBe(true);
            expect(result.productsCount).toBe(1);
            expect(result.csvContent).toContain('456');
        });
    });
});
