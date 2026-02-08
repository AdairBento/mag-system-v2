/**
 * CNH (Carteira Nacional de Habilitação) Validator
 * 
 * Validates and normalizes Brazilian driver's license numbers.
 * 
 * Format: 11 numeric digits (e.g., 12345678901)
 */
export class CnhValidator {
  /**
   * Normalizes CNH by removing all non-numeric characters
   */
  static normalize(cnh: string): string {
    if (!cnh) return '';
    return cnh.replace(/\D/g, '');
  }

  /**
   * Validates CNH format and checksum
   */
  static isValid(cnh: string): boolean {
    if (!cnh) return false;

    const normalized = this.normalize(cnh);

    // Must have exactly 11 digits
    if (normalized.length !== 11) return false;

    // Cannot have all digits the same
    if (/^(\d)\1+$/.test(normalized)) return false;

    // Validate checksum
    return this.validateChecksum(normalized);
  }

  /**
   * Formats CNH to standard format: XXX.XXX.XXX-XX
   */
  static format(cnh: string): string {
    const normalized = this.normalize(cnh);
    
    if (normalized.length !== 11) {
      return normalized;
    }

    return normalized.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Validates CNH checksum using official algorithm
   */
  private static validateChecksum(cnh: string): boolean {
    // First digit verification
    let sum = 0;
    let multiplier = 9;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cnh[i]) * multiplier;
      multiplier--;
    }

    let firstDigit = sum % 11;
    if (firstDigit >= 10) firstDigit = 0;

    // Second digit verification
    sum = 0;
    multiplier = 1;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cnh[i]) * multiplier;
      multiplier++;
    }

    let secondDigit = sum % 11;
    if (secondDigit >= 10) secondDigit = 0;

    // Verify both check digits
    return (
      firstDigit === parseInt(cnh[9]) &&
      secondDigit === parseInt(cnh[10])
    );
  }

  /**
   * Validates CNH category
   */
  static isValidCategory(category: string): boolean {
    if (!category) return false;

    const validCategories = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];
    return validCategories.includes(category.toUpperCase());
  }

  /**
   * Checks if CNH is expired
   */
  static isExpired(expirationDate: Date): boolean {
    if (!expirationDate) return true;
    return new Date() > new Date(expirationDate);
  }

  /**
   * Checks if CNH is expiring soon (within specified days)
   */
  static isExpiringSoon(expirationDate: Date, daysThreshold: number = 30): boolean {
    if (!expirationDate) return false;
    
    const now = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiration = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiration <= daysThreshold && daysUntilExpiration >= 0;
  }
}
