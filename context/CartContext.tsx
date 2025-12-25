import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { wooService } from '../services/wooService';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  addToCart: (product: Product, variant: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, variant: string) => Promise<void>;
  updateQuantity: (productId: string, variant: string, quantity: number) => Promise<void>;
  toggleCart: () => void;
  cartTotal: number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Store cart keys from WordPress for syncing
const cartKeysMap = new Map<string, string>(); // Maps "productId-variant" to WordPress cart key

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync cart from WordPress on mount
  useEffect(() => {
    syncCart();
  }, []);

  // Transform WordPress cart items to our CartItem format
  const transformWooCartItem = (wooItem: any): CartItem | null => {
    const product = wooItem.product?.node;
    if (!product) return null;

    const variantKey = wooItem.variation?.attributes
      ?.map((attr: any) => `${attr.name}:${attr.value}`).join(', ') || 'default';

    const cartKey = `${product.databaseId || product.id}-${variantKey}`;
    cartKeysMap.set(cartKey, wooItem.key);

    return {
      id: product.id,
      title: product.name || '',
      price: typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^0-9.]/g, '') || '0')
        : product.price || 0,
      image: product.image?.sourceUrl || '',
      category: 'Uncategorized',
      baseDescription: '',
      slug: product.slug,
      variant: variantKey,
      quantity: wooItem.quantity || 1,
      databaseId: product.databaseId,
    };
  };

  const syncCart = async () => {
    try {
      setIsLoading(true);
      const wooCart = await wooService.getCart();
      
      if (wooCart?.contents?.nodes) {
        const transformedCart = wooCart.contents.nodes
          .map(transformWooCartItem)
          .filter((item): item is CartItem => item !== null);
        setCart(transformedCart);
      }
    } catch (error) {
      console.error("Failed to sync cart from WordPress", error);
      // Keep local cart state on error
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, variant: string, quantity: number = 1) => {
    if (!product.databaseId) {
      console.error("Product missing databaseId, cannot add to WordPress cart");
      // Fallback to local-only cart
      setCart((prev) => {
        const existing = prev.find(item => item.id === product.id && item.variant === variant);
        if (existing) {
          return prev.map(item => 
            item.id === product.id && item.variant === variant
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, variant, quantity }];
      });
      setIsCartOpen(true);
      return;
    }

    // Optimistic update
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id && item.variant === variant);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.variant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, variant, quantity }];
    });
    setIsCartOpen(true);

    // Sync with WordPress
    try {
      await wooService.addToCart(product.databaseId, quantity);
      await syncCart(); // Refresh cart from WordPress
    } catch (error) {
      console.error("Failed to add to WordPress cart", error);
      // Revert optimistic update on error
      await syncCart();
    }
  };

  const removeFromCart = async (productId: string, variant: string) => {
    const cartKey = cartKeysMap.get(`${productId}-${variant}`);
    
    // Optimistic update
    setCart(prev => prev.filter(item => !(item.id === productId && item.variant === variant)));
    
    if (cartKey) {
      try {
        await wooService.removeFromCart([cartKey]);
      } catch (error) {
        console.error("Failed to remove from WordPress cart", error);
        await syncCart(); // Revert on error
      }
    }
  };

  const updateQuantity = async (productId: string, variant: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(productId, variant);
      return;
    }

    const cartKey = cartKeysMap.get(`${productId}-${variant}`);
    
    // Optimistic update
    setCart(prev => prev.map(item => 
      item.id === productId && item.variant === variant
        ? { ...item, quantity }
        : item
    ));

    if (cartKey) {
      try {
        await wooService.updateCartItem(cartKey, quantity);
        await syncCart(); // Refresh from WordPress
      } catch (error) {
        console.error("Failed to update WordPress cart", error);
        await syncCart(); // Revert on error
      }
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      isCartOpen, 
      isLoading,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleCart, 
      cartTotal,
      syncCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};