import { addDays, differenceInDays, isAfter, isBefore, isValid, parseISO } from 'date-fns';

/**
 * Calcula número de dias entre duas datas
 */
export function calculateRentalDays(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate) + 1; // +1 para incluir o primeiro dia
}

/**
 * Valida se período de locação é válido
 */
export function isValidRentalPeriod(startDate: Date, endDate: Date): boolean {
  if (!isValid(startDate) || !isValid(endDate)) return false;
  if (!isAfter(endDate, startDate)) return false;
  return true;
}

/**
 * Verifica se duas locações se sobrepõem
 */
export function hasDateOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean {
  return isBefore(start1, end2) && isAfter(end1, start2);
}

/**
 * Adiciona dias a uma data
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

/**
 * Converte string ISO para Date
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}
