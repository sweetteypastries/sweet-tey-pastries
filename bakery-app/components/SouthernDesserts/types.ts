/**
 * Shared application types for Sweet Tey's Pastries V2.
 */

export type ID = string;

export type CurrencyCode = "USD";

export type ISODateString = string;

export type FulfillmentMethod = "pickup" | "delivery";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially-refunded";

export type PaymentMethod =
  | "card"
  | "cash"
  | "invoice"
  | "other";

export type ProductCategory =
  | "cakes"
  | "pies"
  | "cobblers"
  | "parfaits"
  | "cupcakes"
  | "macarons"
  | "strawberries"
  | "beignets"
  | "specialty"
  | "seasonal";

export type DietaryTag =
  | "gluten-free"
  | "dairy-free"
  | "egg-free"
  | "nut-free"
  | "vegan"
  | "vegetarian";

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id?: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ProductOption {
  id: ID;
  label: string;
  priceAdjustment?: number;
  available?: boolean;
}

export interface ProductOptionGroup {
  id: ID;
  name: string;
  required?: boolean;
  multiple?: boolean;
  options: ProductOption[];
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  image: string;
  images?: string[];
  basePrice?: number;
  priceLabel?: string;
  available: boolean;
  featured?: boolean;
  seasonal?: boolean;
  dietaryTags?: DietaryTag[];
  allergenNotice?: string;
  optionGroups?: ProductOptionGroup[];
}

export interface CartItemInput {
  id: ID;
  name: string;
  option?: string;
  price: number;
  image?: string;
  productId?: ID;
  selectedOptions?: Record<string, string | string[]>;
  specialInstructions?: string;
}

export interface CartItem extends CartItemInput {
  cartItemId: ID;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface CartContextValue extends CartState {
  addItem: (item: CartItemInput) => void;
  removeItem: (cartItemId: ID) => void;
  updateQuantity: (cartItemId: ID, quantity: number) => void;
  updateInstructions: (
    cartItemId: ID,
    specialInstructions: string,
  ) => void;
  clearCart: () => void;
}

export interface FulfillmentDetails {
  method: FulfillmentMethod;
  requestedDate: string;
  requestedTime: string;
  address?: Address;
  deliveryDistanceMiles?: number;
  deliveryFee?: number;
  instructions?: string;
}

export interface OrderPricing {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
}

export interface Order {
  id: ID;
  orderNumber: string;
  customer: Customer;
  items: CartItem[];
  fulfillment: FulfillmentDetails;
  pricing: OrderPricing;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CheckoutFormData {
  customer: Customer;
  fulfillment: FulfillmentDetails;
  paymentMethod?: PaymentMethod;
  notes?: string;
  acceptedTerms: boolean;
}

export interface CreateOrderInput {
  customer: Customer;
  items: CartItem[];
  fulfillment: FulfillmentDetails;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface CreateOrderResult {
  success: boolean;
  order?: Order;
  error?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface Testimonial {
  id: ID;
  customerName: string;
  quote: string;
  rating: number;
  location?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "tiktok" | "x" | "other";
  href: string;
  label: string;
}

export interface BusinessHours {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address?: Address;
  serviceAreaMiles: number;
  hours?: BusinessHours[];
  socialLinks?: SocialLink[];
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;