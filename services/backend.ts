import { Product } from '../types';
import { products as demoProducts } from '../data/products';

// OpenCart API Configuration
const API_CONFIG = {
  baseUrl: 'https://your-opencart-site.com/index.php?route=api', // Replace with your actual URL
  apiToken: 'YOUR_OPENCART_API_TOKEN', // Replace with your token
};

/**
 * Maps OpenCart product format to our internal Product interface.
 */
const mapOpenCartProduct = (ocProduct: any): Product => ({
  id: ocProduct.product_id,
  title: ocProduct.name,
  price: parseFloat(ocProduct.price),
  image: ocProduct.thumb || ocProduct.image || '',
  category: ocProduct.category_name || 'Uncategorized',
  baseDescription: ocProduct.description || '',
});

export const backend = {
  /**
   * Fetch all products from OpenCart
   */
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/product/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${API_CONFIG.apiToken}` 
        },
      });

      if (!response.ok) throw new Error('API Network response was not ok');
      
      const data = await response.json();
      // Ensure the response structure matches your OpenCart API output
      if (!data.products || !Array.isArray(data.products)) {
         return []; 
      }
      return data.products.map(mapOpenCartProduct);
    } catch (error) {
      console.warn("OpenCart API unavailable or unreachable. Falling back to demo data.", error);
      // Fallback to demo data so the app doesn't crash during development/demo
      return demoProducts;
    }
  },

  /**
   * Add a new product to OpenCart
   */
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/product/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (!response.ok) throw new Error('Failed to add product');

      const data = await response.json();
      return mapOpenCartProduct(data.product);
    } catch (error) {
      console.warn("OpenCart API unavailable. Simulating add product.", error);
      // Return a simulated product so the UI optimistic update persists
      return { ...product, id: `simulated-${Date.now()}` };
    }
  },

  /**
   * Update an existing product in OpenCart
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/product/edit&product_id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update product');
    } catch (error) {
      console.warn("OpenCart API unavailable. Simulating update.", error);
    }
  },

  /**
   * Delete a product from OpenCart
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/product/delete&product_id=${id}`, {
        method: 'POST' 
      });

      if (!response.ok) throw new Error('Failed to delete product');
    } catch (error) {
      console.warn("OpenCart API unavailable. Simulating delete.", error);
    }
  }
};