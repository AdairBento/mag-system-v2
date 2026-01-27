import { DOCUMENT_PATTERNS } from '../constants';

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (!DOCUMENT_PATTERNS.CPF.test(cleaned)) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (!DOCUMENT_PATTERNS.CNPJ.test(cleaned)) return false;
  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Formata CPF (123.456.789-00)
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '..-');
}

/**
 * Formata CNPJ (12.345.678/0001-90)
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '../-');
}

/**
 * Remove formatação de documento
 */
export function cleanDocument(document: string): string {
  return document.replace(/\D/g, '');
}

/**
 * Valida placa de veículo (ABC-1234 ou ABC1D23)
 */
export function validatePlate(plate: string): boolean {
  const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  return DOCUMENT_PATTERNS.PLATE.test(cleaned);
}

/**
 * Formata placa (ABC-1234)
 */
export function formatPlate(plate: string): string {
  const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
  return cleaned.replace(/([A-Z]{3})(\d[A-Z0-9]\d{2})/, '-');
}
