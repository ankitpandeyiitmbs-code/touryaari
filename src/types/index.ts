// Touryaari Travels - TypeScript Types

// =====================================================
// USER TYPES
// =====================================================
export type UserRole = 'user' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// TOUR TYPES
// =====================================================
export type TourCategory = 
  | 'road-trip' 
  | 'spiritual' 
  | 'weekend' 
  | 'customised' 
  | 'international' 
  | 'trekking' 
  | 'adventure';

export type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Expert';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
  activities: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  destination: string;
  location_detail: string | null;
  state: string | null;
  country: string | null;
  category: TourCategory;
  sub_category: string | null;
  duration_days: number;
  duration_nights: number;
  price_single: number;
  price_double: number | null;
  price_triple: number | null;
  price_quad: number | null;
  original_price: number | null;
  discount_percent: number;
  group_size_min: number;
  group_size_max: number;
  difficulty: Difficulty | null;
  thumbnail_url: string | null;
  gallery_images: string[] | null;
  itinerary: ItineraryDay[];
  inclusions: string[] | null;
  exclusions: string[] | null;
  highlights: string[] | null;
  things_to_carry: string[] | null;
  faqs: FAQ[];
  activities: string[] | null;
  best_time: string | null;
  pickup_point: string | null;
  departure_city: string | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_popular: boolean;
  is_limited_seats: boolean;
  available_seats: number | null;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// DESTINATION TYPES
// =====================================================
export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  state: string | null;
  country: string | null;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  banner_url: string | null;
  tour_count: number;
  is_featured: boolean;
  is_international: boolean;
  best_time: string | null;
  climate: string | null;
  famous_for: string[] | null;
  sort_order: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
}

// =====================================================
// BOOKING TYPES
// =====================================================
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';
export type SharingType = 'single' | 'double' | 'triple' | 'quad';

export interface Booking {
  id: string;
  booking_ref: string;
  tour_id: string | null;
  tour_title: string;
  tour_slug: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string | null;
  travel_date: string;
  adults: number;
  children: number;
  sharing_type: SharingType;
  total_amount: number;
  advance_amount: number;
  balance_amount: number;
  gst_amount: number;
  special_requests: string | null;
  status: BookingStatus;
  payment_status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  tour_id: string;
  travel_date: string;
  sharing_type: SharingType;
  adults: number;
  children: number;
  special_requests?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city?: string;
}

// =====================================================
// INQUIRY TYPES
// =====================================================
export type InquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';
export type InquirySource = 'contact-page' | 'inquiry-modal' | 'tour-page';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string | null;
  travel_date: string | null;
  travellers: number;
  budget: string | null;
  message: string | null;
  source: InquirySource;
  status: InquiryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// TESTIMONIAL TYPES
// =====================================================
export type TestimonialPlatform = 'google' | 'facebook' | 'website' | 'instagram';

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  avatar_url: string | null;
  rating: number;
  review: string;
  tour_name: string | null;
  platform: TestimonialPlatform | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  date: string;
  created_at: string;
}

// =====================================================
// BLOG POST TYPES
// =====================================================
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author_name: string | null;
  author_avatar: string | null;
  category: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  read_time: number | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// GALLERY TYPES
// =====================================================
export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// HERO SLIDE TYPES
// =====================================================
export interface HeroSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string;
  cta_link: string;
  image_url: string | null;
  video_url: string | null;
  badge_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// =====================================================
// SITE SETTINGS TYPES
// =====================================================
export interface SiteSettings {
  id: string;
  // Branding
  site_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  // Hero
  hero_title: string;
  hero_subtitle: string;
  // Contact
  phone_primary: string | null;
  phone_secondary: string | null;
  email: string;
  whatsapp: string | null;
  address: string | null;
  // Social
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  tripadvisor_url: string | null;
  // About
  about_text: string | null;
  about_image_url: string | null;
  // Footer
  footer_text: string;
  // SEO
  meta_title: string | null;
  meta_description: string | null;
  google_analytics_id: string | null;
  facebook_pixel_id: string | null;
  // Theme colors
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  // Section headings
  popular_tours_heading: string;
  popular_tours_subtext: string | null;
  destinations_heading: string;
  destinations_subtext: string | null;
  why_choose_heading: string;
  why_choose_subtext: string | null;
  testimonials_heading: string;
  blog_heading: string;
  blog_subtext: string | null;
  newsletter_heading: string;
  newsletter_subtext: string | null;
  // Special offers
  offer1_title: string | null;
  offer1_subtitle: string | null;
  offer1_image: string | null;
  offer1_cta: string | null;
  offer1_link: string | null;
  offer2_title: string | null;
  offer2_subtitle: string | null;
  offer2_image: string | null;
  offer2_cta: string | null;
  offer2_link: string | null;
  offer3_title: string | null;
  offer3_subtitle: string | null;
  offer3_image: string | null;
  offer3_cta: string | null;
  offer3_link: string | null;
  // Stats
  stat1_number: string;
  stat1_label: string;
  stat2_number: string;
  stat2_label: string;
  stat3_number: string;
  stat3_label: string;
  stat4_number: string;
  stat4_label: string;
  // Why choose us cards
  why1_icon: string;
  why1_title: string | null;
  why1_text: string | null;
  why2_icon: string;
  why2_title: string | null;
  why2_text: string | null;
  why3_icon: string;
  why3_title: string | null;
  why3_text: string | null;
  why4_icon: string;
  why4_title: string | null;
  why4_text: string | null;
  why5_icon: string;
  why5_title: string | null;
  why5_text: string | null;
  why6_icon: string;
  why6_title: string | null;
  why6_text: string | null;
  why7_icon: string;
  why7_title: string | null;
  why7_text: string | null;
  why8_icon: string;
  why8_title: string | null;
  why8_text: string | null;
  // Payment
  razorpay_key_id: string | null;
  currency: string;
  gst_percentage: number;
  booking_advance_percent: number;
  // Widgets
  show_whatsapp_widget: boolean;
  show_call_widget: boolean;
  whatsapp_message_template: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  // Policies
  privacy_policy_content: string | null;
  terms_content: string | null;
  refund_policy_content: string | null;
  // Maps
  google_maps_embed_url: string | null;
  updated_at: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =====================================================
// RAZORPAY TYPES
// =====================================================
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// =====================================================
// STATS TYPES
// =====================================================
export interface DashboardStats {
  total_tours: number;
  total_bookings: number;
  monthly_revenue: number;
  new_inquiries: number;
  total_users: number;
  bookings_by_month: {
    month: string;
    count: number;
    revenue: number;
  }[];
}

// =====================================================
// FILTER TYPES
// =====================================================
export interface TourFilters {
  category?: TourCategory;
  destination?: string;
  duration?: number;
  priceMin?: number;
  priceMax?: number;
  difficulty?: Difficulty;
  search?: string;
}

// =====================================================
// FORM VALIDATION TYPES
// =====================================================
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  destination?: string;
  message?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  destination?: string;
  travel_date?: string;
  travellers?: number;
  budget?: string;
  message?: string;
}
