import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { wooService } from '../services/wooService';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await wooService.getProducts(50);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      // In production, you might want to show an error state
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    // Note: Adding products via GraphQL typically requires admin authentication
    // This is a placeholder - in production, you'd call WordPress admin API
    console.warn("Adding products via GraphQL requires admin authentication");
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Note: Updating products via GraphQL typically requires admin authentication
    // This is a placeholder - in production, you'd call WordPress admin API
    console.warn("Updating products via GraphQL requires admin authentication");
    // Optimistic update for UI
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = async (id: string) => {
    // Note: Deleting products via GraphQL typically requires admin authentication
    // This is a placeholder - in production, you'd call WordPress admin API
    console.warn("Deleting products via GraphQL requires admin authentication");
    // Optimistic update for UI
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};