export class CpfValidator {
  static normalize(input: string): string {
    return (input ?? '').replace(/\D/g, '');
  }

  static format(input: string): string {
    const cpf = CpfValidator.normalize(input);
    if (cpf.length !== 11) return input;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  static validate(input: string): boolean {
    const cpf = CpfValidator.normalize(input);

    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    const calcDigit = (base: string, factor: number): number => {
      let sum = 0;
      for (let i = 0; i < base.length; i++) {
        sum += Number(base[i]) * (factor - i);
      }
      const mod = sum % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    const d1 = calcDigit(cpf.slice(0, 9), 10);
    const d2 = calcDigit(cpf.slice(0, 10), 11);

    return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
  }
}
