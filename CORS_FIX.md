# CORS Configuration Fix

## The Problem

You're seeing this error:
```
Access-Control-Allow-Origin header in the response must not be the wildcard '*' 
when the request's credentials mode is 'include'
```

This happens because:
1. Your WordPress site is returning `Access-Control-Allow-Origin: *` (wildcard)
2. The React app uses `credentials: 'include'` for cart operations
3. Browsers **don't allow** wildcard CORS when credentials are included (security feature)

## The Fix (React Side)

I've already fixed this in the code:
- ✅ **Read-only operations** (products, categories) now use `credentials: 'omit'` - works with wildcard CORS
- ✅ **Cart operations** (add, update, remove, checkout) use `credentials: 'include'` - requires specific origin

## WordPress CORS Configuration

For cart operations to work, you need to update your WordPress CORS configuration to specify your React app's origin instead of using wildcard.

### Option 1: Update WordPress functions.php

Add this to your WordPress theme's `functions.php`:

```php
<?php
// Fix CORS for GraphQL with credentials
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'http://localhost:3000',
            'http://192.168.2.65:3000', // Your current dev IP
            'https://your-production-domain.com', // Add your production domain
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
        }
        
        return $value;
    });
}, 15);

// Handle preflight requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = get_http_origin();
        $allowed_origins = [
            'http://localhost:3000',
            'http://192.168.2.65:3000',
            'https://your-production-domain.com',
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            exit(0);
        }
    }
});
```

### Option 2: Use WPGraphQL CORS Plugin

1. Install the "WPGraphQL CORS" plugin
2. Configure it to allow your React app origin:
   - Go to Settings → WPGraphQL CORS
   - Add your origins: `http://localhost:3000`, `http://192.168.2.65:3000`, etc.
   - Enable "Allow Credentials"

### Option 3: Use .htaccess (Apache)

If you're on Apache, add to your `.htaccess`:

```apache
<IfModule mod_headers.c>
    # Replace with your actual React app URL
    SetEnvIf Origin "http(s)?://(www\.)?(localhost:3000|192\.168\.2\.65:3000|your-production-domain\.com)$" AccessControlAllowOrigin=$0
    Header always set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header always set Access-Control-Allow-Credentials "true" env=AccessControlAllowOrigin
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS" env=AccessControlAllowOrigin
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization" env=AccessControlAllowOrigin
</IfModule>
```

## Current Status

✅ **Products & Categories**: Working (no credentials needed)
⚠️ **Cart Operations**: Will work once WordPress CORS is fixed

## Testing

After updating WordPress CORS:

1. **Test Products**: Should load without errors
2. **Test Cart**: Try adding items to cart
3. **Check Browser Console**: Should see no CORS errors

## Production

For production, make sure to:
- Add your production React app URL to the allowed origins
- Remove localhost/IP addresses or keep them for development only
- Use HTTPS for both WordPress and React app

