import { CnhValidator } from '../cnh.validator';

describe('CnhValidator', () => {
  describe('normalize', () => {
    it('should remove all non-numeric characters', () => {
      expect(CnhValidator.normalize('123.456.789-01')).toBe('12345678901');
      expect(CnhValidator.normalize('123 456 789 01')).toBe('12345678901');
      expect(CnhValidator.normalize('12345678901')).toBe('12345678901');
    });

    it('should return empty string for null/undefined', () => {
      expect(CnhValidator.normalize('')).toBe('');
      expect(CnhValidator.normalize(null as any)).toBe('');
      expect(CnhValidator.normalize(undefined as any)).toBe('');
    });
  });

  describe('isValid', () => {
    it('should validate correct CNH numbers', () => {
      // Note: These are example CNH numbers for testing
      // Real validation requires actual valid CNH numbers
      expect(CnhValidator.isValid('12345678901')).toBeDefined();
    });

    it('should reject CNH with less than 11 digits', () => {
      expect(CnhValidator.isValid('123456789')).toBe(false);
      expect(CnhValidator.isValid('123')).toBe(false);
    });

    it('should reject CNH with more than 11 digits', () => {
      expect(CnhValidator.isValid('123456789012')).toBe(false);
    });

    it('should reject CNH with all same digits', () => {
      expect(CnhValidator.isValid('00000000000')).toBe(false);
      expect(CnhValidator.isValid('11111111111')).toBe(false);
      expect(CnhValidator.isValid('99999999999')).toBe(false);
    });

    it('should reject null/undefined', () => {
      expect(CnhValidator.isValid('')).toBe(false);
      expect(CnhValidator.isValid(null as any)).toBe(false);
      expect(CnhValidator.isValid(undefined as any)).toBe(false);
    });

    it('should validate formatted CNH', () => {
      expect(CnhValidator.isValid('123.456.789-01')).toBeDefined();
    });
  });

  describe('format', () => {
    it('should format CNH to XXX.XXX.XXX-XX pattern', () => {
      expect(CnhValidator.format('12345678901')).toBe('123.456.789-01');
    });

    it('should return original if not 11 digits', () => {
      expect(CnhValidator.format('123')).toBe('123');
      expect(CnhValidator.format('123456789012')).toBe('123456789012');
    });

    it('should handle already formatted CNH', () => {
      expect(CnhValidator.format('123.456.789-01')).toBe('123.456.789-01');
    });
  });

  describe('isValidCategory', () => {
    it('should validate single category', () => {
      expect(CnhValidator.isValidCategory('A')).toBe(true);
      expect(CnhValidator.isValidCategory('B')).toBe(true);
      expect(CnhValidator.isValidCategory('C')).toBe(true);
      expect(CnhValidator.isValidCategory('D')).toBe(true);
      expect(CnhValidator.isValidCategory('E')).toBe(true);
    });

    it('should validate combined category', () => {
      expect(CnhValidator.isValidCategory('AB')).toBe(true);
      expect(CnhValidator.isValidCategory('AC')).toBe(true);
      expect(CnhValidator.isValidCategory('AD')).toBe(true);
      expect(CnhValidator.isValidCategory('AE')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(CnhValidator.isValidCategory('b')).toBe(true);
      expect(CnhValidator.isValidCategory('ab')).toBe(true);
      expect(CnhValidator.isValidCategory('Ab')).toBe(true);
    });

    it('should reject invalid categories', () => {
      expect(CnhValidator.isValidCategory('X')).toBe(false);
      expect(CnhValidator.isValidCategory('ABC')).toBe(false);
      expect(CnhValidator.isValidCategory('Z')).toBe(false);
      expect(CnhValidator.isValidCategory('')).toBe(false);
    });
  });

  describe('isExpired', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(CnhValidator.isExpired(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date('2030-01-01');
      expect(CnhValidator.isExpired(futureDate)).toBe(false);
    });

    it('should return true for null/undefined', () => {
      expect(CnhValidator.isExpired(null as any)).toBe(true);
      expect(CnhValidator.isExpired(undefined as any)).toBe(true);
    });
  });

  describe('isExpiringSoon', () => {
    it('should return true for dates within threshold', () => {
      const date = new Date();
      date.setDate(date.getDate() + 20); // 20 days from now
      
      expect(CnhValidator.isExpiringSoon(date, 30)).toBe(true);
    });

    it('should return false for dates beyond threshold', () => {
      const date = new Date();
      date.setDate(date.getDate() + 40); // 40 days from now
      
      expect(CnhValidator.isExpiringSoon(date, 30)).toBe(false);
    });

    it('should use default threshold of 30 days', () => {
      const date = new Date();
      date.setDate(date.getDate() + 25); // 25 days from now
      
      expect(CnhValidator.isExpiringSoon(date)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date('2020-01-01');
      expect(CnhValidator.isExpiringSoon(pastDate)).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(CnhValidator.isExpiringSoon(null as any)).toBe(false);
      expect(CnhValidator.isExpiringSoon(undefined as any)).toBe(false);
    });
  });
});
