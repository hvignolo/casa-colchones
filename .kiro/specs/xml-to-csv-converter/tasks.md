# Implementation Plan

- [x] 1. Create XML to CSV converter module





  - Create `src/xmlToCsvConverter.ts` with core conversion logic
  - Implement interfaces for ParsedXmlProduct, XmlConversionResult, and XmlFieldMapping
  - Implement field mapping configuration with alternative names
  - _Requirements: 2.1, 2.2_

- [x] 1.1 Implement XML parsing function


  - Write `parseXmlToProducts()` function using DOMParser
  - Handle multiple XML structures (flat lists, attributes, hierarchical)
  - Extract products with required fields (código, precio)
  - _Requirements: 1.3, 2.3, 2.5_

- [ ]* 1.2 Write property test for XML parsing
  - **Property 2: XML parsing extracts all valid products**
  - **Validates: Requirements 2.5**

- [x] 1.3 Implement field mapping function


  - Write `mapXmlField()` to handle alternative field names
  - Support both element text content and attributes
  - Return null for fields not found
  - _Requirements: 2.1, 2.2_

- [ ]* 1.4 Write property test for field mapping
  - **Property 3: Field mapping handles alternative names**
  - **Validates: Requirements 2.2**

- [x] 1.5 Implement CSV generation function


  - Write `generateCsvFromProducts()` to create CSV string
  - Implement CSV value escaping for special characters
  - Preserve UTF-8 encoding for accents and special characters
  - Maintain decimal precision for prices
  - _Requirements: 1.4, 4.1, 4.2, 4.3_

- [ ]* 1.6 Write property test for data integrity
  - **Property 4: Data integrity during conversion**
  - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 1.7 Implement main conversion function


  - Write `convertXmlToCsv()` as the main entry point
  - Orchestrate parsing, mapping, and CSV generation
  - Return XmlConversionResult with success status and product count
  - _Requirements: 1.3, 1.4, 1.5_

- [ ]* 1.8 Write property test for round-trip consistency
  - **Property 5: Conversion round-trip consistency**
  - **Validates: Requirements 4.5, 1.5**

- [x] 2. Implement error handling and validation





  - Add XML validation checks (well-formed, not empty)
  - Implement specific error messages for different failure types
  - Handle graceful skipping of invalid products
  - _Requirements: 2.4, 3.3, 3.5, 4.4_

- [x] 2.1 Add file extension validation


  - Implement validation function for .xml extension
  - Make validation case-insensitive
  - _Requirements: 1.2_

- [ ]* 2.2 Write property test for file validation
  - **Property 1: XML file extension validation**
  - **Validates: Requirements 1.2**

- [x] 2.3 Implement error message constants


  - Add XML_ERROR_MESSAGES to constants.ts
  - Include specific messages for each error type
  - _Requirements: 3.3, 3.5_

- [ ]* 2.4 Write property test for error messages
  - **Property 6: Specific error messages for failures**
  - **Validates: Requirements 3.3, 3.5**

- [x] 2.5 Add validation for required fields


  - Check that products have código and precio
  - Skip products with missing required fields
  - Continue processing remaining valid products
  - _Requirements: 4.4_

- [ ]* 2.6 Write property test for invalid product handling
  - **Property 7: Graceful handling of invalid products**
  - **Validates: Requirements 4.4**

- [x] 3. Update AdminDashboard component





  - Extract CSV processing logic to reusable function `processCSVContent()`
  - Implement `handleImportXmlPriceList()` handler
  - Integrate XML converter with existing price update logic
  - Add success/error toast messages with product counts
  - _Requirements: 1.5, 3.2, 3.4_

- [ ]* 3.1 Write property test for success feedback
  - **Property 8: Success feedback includes product count**
  - **Validates: Requirements 3.2, 3.4**

- [x] 4. Update SettingsModal component




  - Add new prop `onImportXmlPriceList` to interface
  - Add XML file input in "prices" view
  - Style XML import section consistently with CSV import
  - Add descriptive text explaining XML import functionality
  - _Requirements: 1.1_

- [x] 5. Update constants file





  - Add XML_ERROR_MESSAGES constant
  - Add SUCCESS_MESSAGES for XML import
  - _Requirements: 3.2, 3.3_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Manual testing and validation
  - Test with sample XML files of different structures
  - Verify special characters and accents are preserved
  - Verify price precision is maintained
  - Test error handling with invalid XML files
  - Verify integration with existing price update logic
  - _Requirements: All_
