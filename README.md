<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CaseDrop - Modern React Frontend for WordPress WooCommerce

A beautiful, modern React e-commerce frontend that connects to your WordPress WooCommerce backend via GraphQL API. Features a premium UI with smooth animations, React-based cart and checkout, and full WordPress integration.

## Features

- ✨ **Modern React UI** - Built with React, TypeScript, and Tailwind CSS
- 🛒 **React Cart & Checkout** - Full cart and checkout functionality in React (no WordPress redirects)
- 🔌 **WordPress GraphQL Integration** - Seamlessly connects to WordPress WooCommerce via WPGraphQL
- 🎨 **Premium Animations** - Smooth Framer Motion animations throughout
- 📱 **Responsive Design** - Works beautifully on all devices
- ⚡ **Fast & Optimized** - Built with Vite for lightning-fast development

## Prerequisites

- Node.js 18+ 
- WordPress site with:
  - WooCommerce plugin installed
  - WPGraphQL plugin installed
  - WPGraphQL for WooCommerce plugin installed
  - CORS configured (see WORDPRESS_SETUP.md)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

```env
# WordPress GraphQL API Configuration
VITE_WP_GRAPHQL_URL=https://api.xdignya.uk/graphql
VITE_WP_SITE_URL=https://api.xdignya.uk

# Optional: Gemini API Key (for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important Notes:**
- `VITE_WP_GRAPHQL_URL` - Your WordPress GraphQL endpoint
- `VITE_WP_SITE_URL` - Your WordPress site base URL (for links/images)
- `VITE_GEMINI_API_KEY` - Optional, only needed for AI "Vibe Check" feature
- **WooCommerce Consumer Key/Secret are NOT needed** - GraphQL uses session-based auth, not REST API keys

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app.

### 4. Build for Production

```bash
npm run build
```

The optimized production files will be in the `dist/` directory.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_WP_GRAPHQL_URL`
   - `VITE_WP_SITE_URL`
   - `VITE_GEMINI_API_KEY` (optional)
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Site settings

### Deploy to Any Static Host

1. Run `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Ensure your WordPress site has CORS configured for your domain

## WordPress Setup

See [WORDPRESS_SETUP.md](WORDPRESS_SETUP.md) for detailed WordPress configuration instructions.

Key requirements:
- ✅ WPGraphQL plugin
- ✅ WooCommerce plugin  
- ✅ WPGraphQL for WooCommerce plugin
- ✅ CORS configuration

## Project Structure

```
casedrop2/
├── components/          # Reusable React components
│   ├── CartDrawer.tsx   # Shopping cart drawer
│   ├── CheckoutModal.tsx # Checkout modal
│   └── Header.tsx       # Site header
├── context/             # React Context providers
│   ├── CartContext.tsx  # Cart state management
│   ├── ProductContext.tsx # Product data
│   └── WishlistContext.tsx # Wishlist state
├── pages/               # Page components
│   ├── HomePage.tsx     # Homepage
│   ├── ShopPage.tsx     # Shop/products listing
│   └── ProductPage.tsx  # Individual product page
├── services/            # API services
│   └── wooService.ts    # WordPress GraphQL integration
└── types.ts             # TypeScript type definitions
```

## Features in Detail

### Cart & Checkout

- Add products to cart with variants
- Update quantities
- Remove items
- Complete checkout directly in React
- Cart syncs with WordPress WooCommerce backend

### Products & Categories

- Fetch products from WordPress
- Filter by category
- Search functionality
- Product detail pages
- Stock status tracking

### UI/UX

- Smooth page transitions
- Loading states
- Error handling
- Responsive design
- Accessible components

## Troubleshooting

### Products Not Loading?

1. Check your WordPress GraphQL endpoint is accessible
2. Verify WPGraphQL and WooCommerce plugins are active
3. Check browser console for CORS errors
4. Ensure environment variables are set correctly

### Cart Not Working?

1. Verify CORS is configured on WordPress
2. Check that cookies/sessions are enabled
3. Ensure `credentials: 'include'` is working (check network tab)

### Checkout Failing?

1. Verify checkout mutation permissions in WordPress
2. Check required fields are filled
3. Ensure payment method is configured in WooCommerce

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WP_GRAPHQL_URL` | WordPress GraphQL endpoint URL | Yes |
| `VITE_WP_SITE_URL` | WordPress site base URL | Yes |
| `VITE_GEMINI_API_KEY` | Gemini API key for AI features | No |

## License

MIT

---

**Built with ❤️ for modern e-commerce**
