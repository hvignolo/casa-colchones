import {
  validateXmlFileExtension,
  validateRequiredFields,
  convertXmlToCsv,
  parseXmlToProducts,
  generateCsvFromProducts,
  mapXmlField,
} from './xmlToCsvConverter';
import { XML_ERROR_MESSAGES } from './constants';

describe('xmlToCsvConverter', () => {
  describe('validateXmlFileExtension', () => {
    it('should return true for valid .xml extension', () => {
      expect(validateXmlFileExtension('file.xml')).toBe(true);
      expect(validateXmlFileExtension('file.XML')).toBe(true);
      expect(validateXmlFileExtension('file.XmL')).toBe(true);
    });

    it('should return false for invalid extensions', () => {
      expect(validateXmlFileExtension('file.txt')).toBe(false);
      expect(validateXmlFileExtension('file.csv')).toBe(false);
      expect(validateXmlFileExtension('file')).toBe(false);
    });

    it('should return false for empty or invalid input', () => {
      expect(validateXmlFileExtension('')).toBe(false);
      expect(validateXmlFileExtension(null as any)).toBe(false);
    });
  });

  describe('validateRequiredFields', () => {
    it('should return true for valid codigo and precio', () => {
      expect(validateRequiredFields('12345', '100.50')).toBe(true);
      expect(validateRequiredFields('ABC', '0')).toBe(true);
    });

    it('should return false for missing codigo', () => {
      expect(validateRequiredFields(null, '100.50')).toBe(false);
      expect(validateRequiredFields('', '100.50')).toBe(false);
      expect(validateRequiredFields('   ', '100.50')).toBe(false);
    });

    it('should return false for missing precio', () => {
      expect(validateRequiredFields('12345', null)).toBe(false);
      expect(validateRequiredFields('12345', '')).toBe(false);
      expect(validateRequiredFields('12345', '   ')).toBe(false);
    });

    it('should return false for invalid precio', () => {
      expect(validateRequiredFields('12345', 'abc')).toBe(false);
      expect(validateRequiredFields('12345', '-10')).toBe(false);
    });
  });

  describe('convertXmlToCsv', () => {
    it('should return error for empty XML', () => {
      const result = convertXmlToCsv('');
      expect(result.success).toBe(false);
      expect(result.error).toBe(XML_ERROR_MESSAGES.EMPTY_FILE);
    });

    it('should return error for malformed XML', () => {
      const malformedXml = '<productos><producto><codigo>123</producto>';
      const result = convertXmlToCsv(malformedXml);
      expect(result.success).toBe(false);
      expect(result.error).toBe(XML_ERROR_MESSAGES.MALFORMED_XML);
    });

    it('should return error when no products found', () => {
      const emptyXml = '<?xml version="1.0"?><productos></productos>';
      const result = convertXmlToCsv(emptyXml);
      expect(result.success).toBe(false);
      expect(result.error).toBe(XML_ERROR_MESSAGES.NO_PRODUCTS_FOUND);
    });

    it('should successfully convert valid XML to CSV', () => {
      const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<productos>
  <producto>
    <codigo>12345</codigo>
    <nombre>Colchón Premium</nombre>
    <medida>2.00 x 1.40</medida>
    <precio>45000.50</precio>
    <estado>activo</estado>
  </producto>
</productos>`;
      
      const result = convertXmlToCsv(validXml);
      expect(result.success).toBe(true);
      expect(result.productsCount).toBe(1);
      expect(result.csvContent).toContain('12345');
      expect(result.csvContent).toContain('45000.50');
    });

    it('should skip products with missing required fields', () => {
      const xmlWithInvalidProducts = `<?xml version="1.0" encoding="UTF-8"?>
<productos>
  <producto>
    <codigo>12345</codigo>
    <nombre>Valid Product</nombre>
    <precio>100.00</precio>
  </producto>
  <producto>
    <nombre>Missing Code</nombre>
    <precio>200.00</precio>
  </producto>
  <producto>
    <codigo>67890</codigo>
    <nombre>Missing Price</nombre>
  </producto>
</productos>`;
      
      const result = convertXmlToCsv(xmlWithInvalidProducts);
      expect(result.success).toBe(true);
      expect(result.productsCount).toBe(1);
      expect(result.csvContent).toContain('12345');
      expect(result.csvContent).not.toContain('67890');
    });
  });

  describe('parseXmlToProducts', () => {
    it('should parse products with different field names', () => {
      const xmlWithAlternativeNames = `<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <code>ABC123</code>
    <name>Test Product</name>
    <price>99.99</price>
  </product>
</products>`;
      
      const products = parseXmlToProducts(xmlWithAlternativeNames);
      expect(products).toHaveLength(1);
      expect(products[0].codigo).toBe('ABC123');
      expect(products[0].precio).toBe(99.99);
    });

    it('should handle attributes', () => {
      const xmlWithAttributes = `<?xml version="1.0" encoding="UTF-8"?>
<lista>
  <item code="XYZ789" price="150.00">
    <name>Attribute Product</name>
  </item>
</lista>`;
      
      const products = parseXmlToProducts(xmlWithAttributes);
      expect(products).toHaveLength(1);
      expect(products[0].codigo).toBe('XYZ789');
      expect(products[0].precio).toBe(150.00);
    });
  });

  describe('generateCsvFromProducts', () => {
    it('should generate CSV with proper escaping', () => {
      const products = [
        {
          codigo: '123',
          nombre: 'Product, with comma',
          medida: '2x1',
          precio: 100.50,
          estado: 'activo',
        },
      ];
      
      const csv = generateCsvFromProducts(products);
      expect(csv).toContain('"Product, with comma"');
      expect(csv).toContain('100.50');
    });

    it('should maintain decimal precision', () => {
      const products = [
        {
          codigo: '456',
          nombre: 'Test',
          medida: '1x1',
          precio: 99.999,
        },
      ];
      
      const csv = generateCsvFromProducts(products);
      expect(csv).toContain('100.00');
    });
  });
});
