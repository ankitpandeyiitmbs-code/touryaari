// Touryaari Travels - Utility Functions

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with Indian Rupee symbol
 */
export function formatPrice(price: number, showCurrency: boolean = true): string {
  const formatted = new Intl.NumberFormat('en-IN').format(Math.round(price));
  return showCurrency ? `₹${formatted}` : formatted;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Format date to short format
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(d);
}

/**
 * Format duration display
 */
export function formatDuration(days: number, nights: number): string {
  return `${days} Days / ${nights} Nights`;
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Calculate read time for content
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate meta title
 */
export function generateMetaTitle(title: string, siteName: string = 'Touryaari Travels'): string {
  return `${title} | ${siteName}`;
}

/**
 * Parse sharing type label
 */
export function getSharingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    single: 'Single Sharing',
    double: 'Double Sharing',
    triple: 'Triple Sharing',
    quad: 'Quad Sharing',
  };
  return labels[type] || type;
}

/**
 * Get category display name
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'road-trip': 'Road Trip',
    spiritual: 'Spiritual Yatra',
    weekend: 'Weekend Getaway',
    customised: 'Customised Tour',
    international: 'International',
    trekking: 'Trekking',
    adventure: 'Adventure',
  };
  return labels[category] || category;
}

/**
 * Get category icon name
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'road-trip': 'Car',
    spiritual: 'Landmark',
    weekend: 'Calendar',
    customised: 'Settings',
    international: 'Plane',
    trekking: 'Mountain',
    adventure: 'Compass',
  };
  return icons[category] || 'MapPin';
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    Easy: 'text-green-600 bg-green-100',
    Moderate: 'text-yellow-600 bg-yellow-100',
    Challenging: 'text-orange-600 bg-orange-100',
    Expert: 'text-red-600 bg-red-100',
  };
  return colors[difficulty] || 'text-gray-600 bg-gray-100';
}

/**
 * Get booking status color
 */
export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-100',
    confirmed: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100',
    completed: 'text-blue-600 bg-blue-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}

/**
 * Get payment status color
 */
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    unpaid: 'text-red-600 bg-red-100',
    partial: 'text-yellow-600 bg-yellow-100',
    paid: 'text-green-600 bg-green-100',
    refunded: 'text-gray-600 bg-gray-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}

/**
 * Get inquiry status color
 */
export function getInquiryStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'text-blue-600 bg-blue-100',
    contacted: 'text-yellow-600 bg-yellow-100',
    converted: 'text-green-600 bg-green-100',
    closed: 'text-gray-600 bg-gray-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}

/**
 * Get star rating array
 */
export function getStarRating(rating: number): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < rating);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(original: number, current: number): number {
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate WhatsApp link
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate phone call link
 */
export function generatePhoneLink(phone: string): string {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  return `tel:${cleanPhone}`;
}

/**
 * Share tour on social media
 */
export function shareTour(platform: 'whatsapp' | 'facebook' | 'twitter', url: string, title: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links: Record<string, string> = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  return links[platform] || '';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[^\d]/g, ''));
}

/**
 * Format phone number to Indian format
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/[^\d]/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  if (clean.length === 12 && clean.startsWith('91')) {
    return `+${clean.slice(0, 2)} ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  return phone;
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Scroll to element by ID
 */
export function scrollToElement(elementId: string, offset: number = 80): void {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Remove empty values from object
 */
export function removeEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ) as Partial<T>;
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitleCase(str: string): string {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
