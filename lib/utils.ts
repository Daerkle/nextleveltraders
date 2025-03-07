import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this in .env
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000/'

  // Stellen Sie sicher, dass die URL mit https:// beginnt, es sei denn, es ist localhost
  url = url.includes('localhost') ? url : url.replace('http://', 'https://')

  // Entfernen Sie trailing slash, falls vorhanden
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("de-DE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${getURL()}${path}`
}
