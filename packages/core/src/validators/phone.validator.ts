/**
 * Validador de telefone brasileiro
 * Formatos aceitos: (11) 98765-4321 ou (11) 3456-7890
 */
export class PhoneValidator {
  static normalize(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  static isValid(phone: string): boolean {
    const normalized = this.normalize(phone);

    // Telefone fixo: 10 dígitos (DDD + 8 dígitos)
    // Celular: 11 dígitos (DDD + 9 dígitos)
    if (normalized.length !== 10 && normalized.length !== 11) {
      return false;
    }

    // DDD deve ser entre 11 e 99
    const ddd = parseInt(normalized.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
      return false;
    }

    // Celular deve começar com 9
    if (normalized.length === 11) {
      const firstDigit = normalized.charAt(2);
      if (firstDigit !== '9') {
        return false;
      }
    }

    return true;
  }

  /**
   * Formata telefone para exibição
   * Ex: 11987654321 -> (11) 98765-4321
   */
  static format(phone: string): string {
    const normalized = this.normalize(phone);

    if (normalized.length === 11) {
      // Celular: (XX) 9XXXX-XXXX
      return `(${normalized.substring(0, 2)}) ${normalized.substring(2, 7)}-${normalized.substring(7)}`;
    }

    if (normalized.length === 10) {
      // Fixo: (XX) XXXX-XXXX
      return `(${normalized.substring(0, 2)}) ${normalized.substring(2, 6)}-${normalized.substring(6)}`;
    }

    return phone;
  }
}
