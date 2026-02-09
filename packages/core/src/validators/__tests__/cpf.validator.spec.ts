import { CpfValidator } from '../cpf.validator';

describe('CpfValidator', () => {
  it('should normalize removing non-digits', () => {
    expect(CpfValidator.normalize('123.456.789-01')).toBe('12345678901');
  });

  it('should format valid-length cpf', () => {
    expect(CpfValidator.format('12345678901')).toBe('123.456.789-01');
  });

  it('should return input unchanged on format if length is not 11', () => {
    expect(CpfValidator.format('123')).toBe('123');
  });

  it('should reject repeated digits', () => {
    expect(CpfValidator.validate('000.000.000-00')).toBe(false);
    expect(CpfValidator.validate('11111111111')).toBe(false);
  });

  it('should validate known valid CPFs', () => {
    expect(CpfValidator.validate('529.982.247-25')).toBe(true);
    expect(CpfValidator.validate('168.995.350-09')).toBe(true);
  });

  it('should reject invalid cpf', () => {
    expect(CpfValidator.validate('123.456.789-00')).toBe(false);
    expect(CpfValidator.validate('529.982.247-26')).toBe(false);
  });
});
