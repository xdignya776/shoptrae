import { Product, CheckoutInput, CartItem } from '../types';
import { products as demoProducts } from '../data/products';

// Configuration for your WordPress GraphQL Endpoint
const WP_API_URL = import.meta.env.VITE_WP_GRAPHQL_URL || 'https://api.xdignya.uk/graphql';
const WP_SITE_URL = import.meta.env.VITE_WP_SITE_URL || 'https://api.xdignya.uk';

/**
 * GraphQL Queries and Mutations
 */
const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        shortDescription
        description
        image {
          sourceUrl
          altText
        }
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

const GET_CATEGORIES_QUERY = `
  query GetCategories {
    productCategories(first: 100) {
      nodes {
        id
        name
        slug
        description
        image {
          sourceUrl
        }
      }
    }
  }
`;

const GET_SINGLE_PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      name
      slug
      shortDescription
      description
      image {
        sourceUrl
        altText
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        stockQuantity
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockStatus
        variations {
          nodes {
            id
            databaseId
            name
            price
            stockStatus
            attributes {
              name
              value
            }
          }
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      ... on VariableProduct {
        defaultAttributes {
          nodes {
            name
            options
          }
        }
      }
      ... on GroupProduct {
        defaultAttributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        product {
          node {
            id
            databaseId
            name
            slug
            image {
              sourceUrl
            }
            ... on SimpleProduct {
              price
            }
          }
        }
        quantity
        subtotal
        total
        variation {
          attributes {
            name
            value
          }
        }
      }
    }
  }
`;

const GET_CART_QUERY = `
  query GetCart {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              databaseId
              name
              slug
              image {
                sourceUrl
              }
              ... on SimpleProduct {
                price
              }
              ... on VariableProduct {
                price
              }
            }
          }
          quantity
          subtotal
          total
          variation {
            attributes {
              name
              value
            }
          }
        }
      }
      subtotal
      total
      totalTax
      shippingTotal
      needsShippingAddress
    }
  }
`;

const UPDATE_CART_ITEM_MUTATION = `
  mutation UpdateCartItem($input: UpdateItemQuantitiesInput!) {
    updateItemQuantities(input: $input) {
      items {
        key
        quantity
      }
      updated {
        removed {
          key
        }
        updated {
          key
        }
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($input: RemoveItemsFromCartInput!) {
    removeItemsFromCart(input: $input) {
      cartItems {
        id
        product {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const CHECKOUT_MUTATION = `
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderNumber
        status
        total
      }
      result
      redirect
      customer {
        id
      }
    }
  }
`;

/**
 * Helper function to make GraphQL requests
 */
async function graphqlRequest(query: string, variables?: any) {
  try {
    const response = await fetch(WP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      credentials: 'include', // Important for cart session
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
  }
}

/**
 * WooCommerce Service
 * Handles data fetching from WPGraphQL and WooCommerce operations
 */
export const wooService = {
  /**
   * Fetch Products from WooCommerce
   */
  async getProducts(first: number = 50): Promise<Product[]> {
    try {
      const data = await graphqlRequest(GET_PRODUCTS_QUERY, { first });

      if (data?.products?.nodes) {
        return data.products.nodes.map(transformWooProduct);
      }

      console.warn("No products found, using demo data.");
      return demoProducts;
    } catch (error) {
      console.warn("WooCommerce API unreachable, using demo data.", error);
      return demoProducts;
    }
  },

  /**
   * Fetch a single product by ID
   */
  async getProduct(id: string): Promise<Product | null> {
    try {
      const data = await graphqlRequest(GET_SINGLE_PRODUCT_QUERY, { id });
      
      if (data?.product) {
        return transformWooProduct(data.product);
      }
      
      return null;
    } catch (error) {
      console.error("Failed to fetch product", error);
      return null;
    }
  },

  /**
   * Fetch Product Categories
   */
  async getCategories(): Promise<Array<{ id: string; name: string; slug: string; description?: string; image?: string }>> {
    try {
      const data = await graphqlRequest(GET_CATEGORIES_QUERY);

      if (data?.productCategories?.nodes) {
        return data.productCategories.nodes.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image?.sourceUrl,
        }));
      }

      // Fallback to demo categories
      return [
        { id: '1', name: 'Leather Series', slug: 'leather-series' },
        { id: '2', name: 'Essential Series', slug: 'essential-series' },
        { id: '3', name: 'Artist Collection', slug: 'artist-collection' },
        { id: '4', name: 'Soft Touch', slug: 'soft-touch' },
        { id: '5', name: 'Performance', slug: 'performance' },
      ];
    } catch (error) {
      console.warn("Failed to fetch categories, using fallback", error);
      return [
        { id: '1', name: 'Leather Series', slug: 'leather-series' },
        { id: '2', name: 'Essential Series', slug: 'essential-series' },
        { id: '3', name: 'Artist Collection', slug: 'artist-collection' },
      ];
    }
  },

  /**
   * Add item to cart
   */
  async addToCart(productId: number, quantity: number = 1, variationId?: number): Promise<any> {
    try {
      const input: any = {
        productId,
        quantity,
      };

      if (variationId) {
        input.variationId = variationId;
      }

      const data = await graphqlRequest(ADD_TO_CART_MUTATION, { input });
      return data?.addToCart?.cartItem || null;
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  },

  /**
   * Get current cart
   */
  async getCart(): Promise<any> {
    try {
      const data = await graphqlRequest(GET_CART_QUERY);
      return data?.cart || null;
    } catch (error) {
      console.error("Failed to get cart", error);
      return null;
    }
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(key: string, quantity: number): Promise<boolean> {
    try {
      const data = await graphqlRequest(UPDATE_CART_ITEM_MUTATION, {
        input: {
          items: [{ key, quantity }],
        },
      });
      return !!data?.updateItemQuantities;
    } catch (error) {
      console.error("Failed to update cart item", error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(keys: string[]): Promise<boolean> {
    try {
      const data = await graphqlRequest(REMOVE_FROM_CART_MUTATION, {
        input: {
          keys,
        },
      });
      return !!data?.removeItemsFromCart;
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    }
  },

  /**
   * Process Checkout
   */
  async processCheckout(input: CheckoutInput, cartItems: CartItem[]): Promise<{ success: boolean; orderId?: number; redirect?: string; error?: string }> {
    try {
      const checkoutInput: any = {
        billing: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          address1: input.address1,
          city: input.city,
          state: input.state,
          postcode: input.postcode,
          country: input.country || 'US',
        },
        shipping: {
          firstName: input.firstName,
          lastName: input.lastName,
          address1: input.address1,
          city: input.city,
          state: input.state,
          postcode: input.postcode,
          country: input.country || 'US',
        },
        paymentMethod: input.paymentMethod || 'bacs', // Default to bank transfer, change as needed
        customerNote: '',
        isPaid: false, // Set to true if payment is processed immediately
      };

      const data = await graphqlRequest(CHECKOUT_MUTATION, { input: checkoutInput });

      if (data?.checkout?.order) {
        return {
          success: true,
          orderId: data.checkout.order.databaseId,
          redirect: data.checkout.redirect,
        };
      }

      return {
        success: false,
        error: data?.checkout?.result || 'Checkout failed',
      };
    } catch (error: any) {
      console.error("Checkout failed", error);
      return {
        success: false,
        error: error.message || 'Checkout failed',
      };
    }
  },

  /**
   * Generate WordPress URLs
   */
  getWordPressUrl: {
    shop: () => `${WP_SITE_URL}/shop`,
    product: (slug: string) => `${WP_SITE_URL}/product/${slug}`,
    cart: () => `${WP_SITE_URL}/cart`,
    checkout: () => `${WP_SITE_URL}/checkout`,
    collections: () => `${WP_SITE_URL}/shop`,
    about: () => `${WP_SITE_URL}/about`,
    contact: () => `${WP_SITE_URL}/contact`,
    faq: () => `${WP_SITE_URL}/faq`,
    shipping: () => `${WP_SITE_URL}/shipping`,
    privacy: () => `${WP_SITE_URL}/privacy`,
  },
};

/**
 * Helper to transform WPGraphQL response to our App's Product type
 */
function transformWooProduct(node: any): Product {
  // Extract price - handle both string and number formats
  let price = 0;
  if (typeof node.price === 'string') {
    price = parseFloat(node.price.replace(/[^0-9.]/g, '') || '0');
  } else if (typeof node.price === 'number') {
    price = node.price;
  } else if (node.salePrice) {
    price = typeof node.salePrice === 'string' 
      ? parseFloat(node.salePrice.replace(/[^0-9.]/g, '') || '0')
      : node.salePrice;
  } else if (node.regularPrice) {
    price = typeof node.regularPrice === 'string'
      ? parseFloat(node.regularPrice.replace(/[^0-9.]/g, '') || '0')
      : node.regularPrice;
  }

  // Extract description - prefer shortDescription, fallback to description
  const description = node.shortDescription || node.description || '';
  const cleanDescription = description.replace(/<[^>]*>?/gm, '').trim();

  return {
    id: node.id || node.databaseId?.toString() || '',
    title: node.name || '',
    price,
    image: node.image?.sourceUrl || '',
    category: node.productCategories?.nodes[0]?.name || 'Uncategorized',
    baseDescription: cleanDescription,
    slug: node.slug || '',
    stockStatus: node.stockStatus || 'IN_STOCK',
    // Store databaseId for cart operations
    ...(node.databaseId && { databaseId: node.databaseId }),
  };
}
