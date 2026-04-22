import crypto from 'crypto';
// Touryaari Travels - Razorpay Integration

import Razorpay from 'razorpay';

// Server-side Razorpay instance (lazy-loaded)
let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay | null {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export const razorpay = {
  orders: {
    create: async (options: any) => {
      const instance = getRazorpayInstance();
      if (!instance) {
        throw new Error('Razorpay credentials not configured');
      }
      return instance.orders.create(options);
    },
  },
};

export interface CreateOrderParams {
  amount: number; // in rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrderResponse> {
  const { amount, currency = 'INR', receipt, notes = {} } = params;

  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency,
    receipt: receipt || `TYT-${Date.now()}`,
    notes,
  });

  return order as RazorpayOrderResponse;
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

// Client-side Razorpay types
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, callback: () => void) => void;
}

// Declare global window interface
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/**
 * Load Razorpay script dynamically
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initialize Razorpay checkout
 */
export async function initializeRazorpayCheckout(
  options: RazorpayOptions
): Promise<RazorpayInstance | null> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    console.error('Failed to load Razorpay script');
    return null;
  }

  return new window.Razorpay(options);
}

/**
 * Calculate booking amounts
 */
export function calculateBookingAmounts(
  basePrice: number,
  adults: number,
  children: number,
  gstPercentage: number = 5,
  advancePercentage: number = 30
): {
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
} {
  const subtotal = basePrice * adults + basePrice * 0.5 * children; // 50% for children
  const gstAmount = subtotal * (gstPercentage / 100);
  const totalAmount = subtotal + gstAmount;
  const advanceAmount = totalAmount * (advancePercentage / 100);
  const balanceAmount = totalAmount - advanceAmount;

  return {
    subtotal,
    gstAmount,
    totalAmount,
    advanceAmount,
    balanceAmount,
  };
}

/**
 * Get sharing price for a tour
 */
export function getSharingPrice(
  tour: {
    price_single: number;
    price_double: number | null;
    price_triple: number | null;
    price_quad: number | null;
  },
  sharingType: 'single' | 'double' | 'triple' | 'quad'
): number {
  switch (sharingType) {
    case 'single':
      return tour.price_single;
    case 'double':
      return tour.price_double || tour.price_single;
    case 'triple':
      return tour.price_triple || tour.price_single;
    case 'quad':
      return tour.price_quad || tour.price_single;
    default:
      return tour.price_single;
  }
}
