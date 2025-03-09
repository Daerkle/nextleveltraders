import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('de-DE').format(value);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function truncate(str: string, length: number) {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `vor ${days}d`;
  if (hours > 0) return `vor ${hours}h`;
  if (minutes > 0) return `vor ${minutes}m`;
  return 'gerade eben';
}

export function isValidDate(date: any) {
  return date instanceof Date && !isNaN(date.getTime());
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getURL() {
  let url = process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000';

  // Stelle sicher, dass die URL mit https:// beginnt, außer bei localhost
  url = url.includes('localhost') ? url : url.replace('http://', 'https://');

  return url;
}
