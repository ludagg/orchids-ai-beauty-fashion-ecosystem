import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number, locale: string = 'en-IN', currency: string = 'INR') {
  return (cents / 100).toLocaleString(locale, { style: 'currency', currency });
}
