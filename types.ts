export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  baseDescription: string;
  // WooCommerce Specific fields
  slug?: string;
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK';
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
  databaseId?: number; // WordPress/WooCommerce database ID for cart operations
}

export interface ProductAttribute {
  id: string;
  name: string; // e.g., "Color", "Model"
  options: string[];
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  stockQuantity?: number;
  attributes: { name: string; value: string }[];
}

export interface CartItem extends Product {
  variant: string;
  quantity: number;
  databaseId?: number; // WP Database ID
}

export enum IphoneModel {
  IPHONE_15_PRO_MAX = "iPhone 15 Pro Max",
  IPHONE_15_PRO = "iPhone 15 Pro",
  IPHONE_15 = "iPhone 15",
  IPHONE_14_PRO_MAX = "iPhone 14 Pro Max",
  IPHONE_14 = "iPhone 14",
}

export interface CheckoutInput {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  paymentMethod: string;
}
