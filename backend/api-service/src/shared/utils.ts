import { createHash, randomBytes } from 'crypto';

export function generateUUID(): string {
  return randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt?: string): string {
  const saltValue = salt || randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + saltValue).digest('hex');
  return `${saltValue}:${hash}`;
}

export function comparePassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  if (!salt || !hash) return false;
  const testHash = createHash('sha256').update(password + salt).digest('hex');
  return testHash === hash;
}

export function formatDateToISO(date: Date): string {
  return date.toISOString();
}

export function generateRandomToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function getCurrentTimestamp(): string {
  return formatDateToISO(new Date());
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

export function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }
}

export function validatePositiveNumber(value: number, fieldName: string): void {
  if (typeof value !== 'number' || value < 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
}

export function validateUUID(id: string, fieldName: string = 'ID'): void {
  const uuidRegex = /^[a-f0-9]{32}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error(`${fieldName} must be a valid UUID`);
  }
}

export function calculateTotalAmount(items: { price: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
