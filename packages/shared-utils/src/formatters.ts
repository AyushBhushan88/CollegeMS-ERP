/**
 * Formats a number as INR currency
 */
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(num);
};

/**
 * Formats a date to DD/MM/YYYY
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};

/**
 * Formats a date to a more readable format (e.g., 24 Apr 2026)
 */
export const formatReadableDate = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

/**
 * Capitalizes the first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Truncates a string to a specified length
 */
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};
