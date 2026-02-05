/**
 * Validador de CEP (Código de Endereçamento Postal) brasileiro
 * Formato: XXXXX-XXX (8 dígitos)
 */
export class CepValidator {
  static normalize(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  static isValid(cep: string): boolean {
    const normalized = this.normalize(cep);

    // CEP deve ter exatamente 8 dígitos
    if (normalized.length !== 8) {
      return false;
    }

    // Não pode ser todos zeros
    if (normalized === '00000000') {
      return false;
    }

    return true;
  }

  /**
   * Formata CEP para exibição
   * Ex: 01310100 -> 01310-100
   */
  static format(cep: string): string {
    const normalized = this.normalize(cep);

    if (normalized.length === 8) {
      return `${normalized.substring(0, 5)}-${normalized.substring(5)}`;
    }

    return cep;
  }
}
