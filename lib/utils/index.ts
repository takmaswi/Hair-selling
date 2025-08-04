import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string, currency: string = 'USD'): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj)
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 7)
  return `TH-${timestamp}-${randomStr}`.toUpperCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}