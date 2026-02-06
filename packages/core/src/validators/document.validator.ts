/**
 * Validators para documentos brasileiros (CPF/CNPJ)
 * Implementa validação de dígitos verificadores
 */

/**
 * Valida CPF (Cadastro de Pessoas Físicas)
 * @param cpf - CPF com ou sem máscara
 * @returns true se válido, false caso contrário
 */
export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // CPF deve ter exatamente 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Rejeita CPFs conhecidos inválidos (todos dígitos iguais)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ (Cadastro Nacional de Pessoa Jurídica)
 * @param cnpj - CNPJ com ou sem máscara
 * @returns true se válido, false caso contrário
 */
export function isValidCNPJ(cnpj: string): boolean {
  if (!cnpj) return false;

  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  // CNPJ deve ter exatamente 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Rejeita CNPJs conhecidos inválidos (todos dígitos iguais)
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (checkDigit !== parseInt(cleanCNPJ.charAt(12))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (checkDigit !== parseInt(cleanCNPJ.charAt(13))) return false;

  return true;
}

/**
 * Valida documento (CPF ou CNPJ) baseado no tamanho
 * @param document - Documento com ou sem máscara
 * @returns true se válido, false caso contrário
 */
export function isValidDocument(document: string): boolean {
  if (!document) return false;

  const cleanDocument = document.replace(/\D/g, '');

  if (cleanDocument.length === 11) {
    return isValidCPF(cleanDocument);
  }

  if (cleanDocument.length === 14) {
    return isValidCNPJ(cleanDocument);
  }

  return false;
}

/**
 * Remove máscara de documento (mantém apenas dígitos)
 * @param document - Documento com máscara
 * @returns Documento sem máscara
 */
export function normalizeDocument(document: string): string {
  return document.replace(/\D/g, '');
}
