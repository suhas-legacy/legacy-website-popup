# Cookie Consent & User Data Capture System

A production-grade GDPR/CCPA-compliant cookie consent and user data capture system for Next.js 16+ (App Router) with Express.js backend.

## Features

- **GDPR/CCPA Compliant Cookie Banner** with granular consent controls
- **Comprehensive Data Collection**: browser fingerprint, device info, location, behavior analytics
- **Real-time Email Notifications** via Resend (backend)
- **No Database Required** - all data sent via email
- **Anonymized Analytics** even when users reject consent
- **Rate Limiting** (10 requests/minute per IP)
- **Security Headers** and CORS protection
- **IP Geolocation** using ip-api.com
- **Backend Integration** via Express.js server

## Architecture

- **Frontend (Next.js)**: Cookie banner UI and data collection
- **Backend (Express.js)**: API endpoint, email sending, IP geolocation
- **Email Service**: Resend for transactional emails

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** in `backend/.env`:
   ```env
   # Cookie Consent & User Data Capture System
   ADMIN_EMAIL=your@email.com
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Configure Resend**:
   - Sign up at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Add it to `RESEND_API_KEY` in `backend/.env`
   - Verify your sender domain

5. **Update sender email** in `backend/trackingService.js`, line 455:
   ```javascript
   from: 'Cookie Consent <noreply@yourdomain.com>',
   ```

6. **Start the backend server**:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Install frontend dependencies**:
   ```bash
   cd legacy-website-popup
   npm install
   ```

2. **Configure environment variables** in `.env`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

   (The `NEXT_PUBLIC_API_URL` should point to your backend server)

3. **Frontend dependencies are already installed**:
   - `uuid` - Unique ID generation
   - `@fingerprintjs/fingerprintjs` - Browser fingerprinting

4. **Start the frontend dev server**:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## How It Works

### On Page Load

1. **Data Collection Hook** (`lib/useDataCollection.ts`) initializes:
   - Generates/retrieves session ID (sessionStorage)
   - Generates/retrieves user ID (localStorage)
   - Starts tracking: clicks, scroll depth, form interactions, time on page
   - Collects browser/device info, fingerprints, cookies, etc.

2. **Cookie Banner** (`components/CookieConsentBanner.tsx`):
   - Checks for existing consent in localStorage
   - Shows banner if no consent exists
   - User can: Accept All, Reject All, or Manage Preferences

### On Consent Decision

1. Consent choices saved to localStorage and as cookie (1-year expiry)
2. Full data payload sent to backend `/api/track` endpoint with consent decision time
3. If user has existing consent, data is sent automatically on page load

### Backend API Endpoint (`/api/track`)

The backend Express.js server handles the tracking endpoint:

1. **Rate Limiting**: 10 requests/minute per IP
2. **IP Geolocation**: Enriches with country, city, region, coordinates, VPN detection
3. **Input Sanitization**: Removes HTML tags from all inputs
4. **Email Notification**: Sends formatted HTML email to ADMIN_EMAIL via Resend
5. **Security Headers**: CORS, HSTS, XSS protection, frame options

The endpoint is defined in `backend/server.js` and implemented in `backend/trackingService.js`.

### Email Content

The email includes:
- **Identity**: Session ID, User ID, Returning User status
- **Location**: IP, Country, City, Region, Coordinates, VPN flag
- **Device & Browser**: Full device and browser details
- **Consent Status**: Each consent toggle + decision time
- **Behavior**: Time on page, scroll depth, clicks, form interactions
- **Traffic Source**: UTM parameters + referrer
- **Fingerprints**: Canvas + WebGL hashes
- **Cookies**: Formatted table (first 20)
- **Raw Payload**: Collapsible full JSON

## Component Structure

### Frontend (Next.js)
```
components/
├── CookieConsentBanner.tsx    # Main banner with preferences modal
├── DataCollectionProvider.tsx # Orchestrates data collection and consent
└── NithyaChat.tsx             # Existing chat component

lib/
└── useDataCollection.ts       # Data collection hook

app/
└── layout.tsx                 # Root layout with DataCollectionProvider
```

### Backend (Express.js)
```
backend/
├── server.js                  # Express server with /api/track endpoint
├── trackingService.js         # Tracking logic, email sending, geolocation
├── emailService.js            # Existing email service for contact forms
└── .env                       # Backend environment variables
```

## Consent Categories

- **Strictly Necessary** (always enabled, cannot be disabled)
- **Analytics** (helps understand visitor behavior)
- **Marketing** (for targeted advertising)
- **Personalization** (remembers preferences)

## Security Features

- **Rate Limiting**: 10 requests/minute per IP to prevent abuse
- **Input Sanitization**: Removes potential XSS vectors
- **CORS Protection**: Restricted to configured domains
- **Security Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Testing

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend dev server**:
   ```bash
   cd legacy-website-popup
   npm run dev
   ```

3. Open your browser (incognito for fresh session)
4. Visit your site at `http://localhost:3000`
5. Cookie banner should appear after 1 second
6. Make a consent choice
7. Check your admin email for the notification

## Troubleshooting

### Emails not sending
- Check backend `RESEND_API_KEY` is correct
- Verify sender domain in Resend dashboard
- Check `ADMIN_EMAIL` is valid in backend `.env`
- Check backend server logs for errors

### Backend connection issues
- Ensure backend server is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in frontend `.env` points to backend
- Check CORS configuration in `backend/server.js`

### Banner not showing
- Clear localStorage and cookies
- Check browser console for errors
- Verify `DataCollectionProvider` is in layout

## Customization

### Change Banner Styling

Edit `components/CookieConsentBanner.tsx` - uses Tailwind CSS classes

### Modify Data Collection

Edit `lib/useDataCollection.ts` to add/remove tracked fields

### Change Email Template

Edit `generateEmailHTML` function in `backend/trackingService.js`

### Adjust Rate Limiting

Modify `maxRequests` and `windowMs` in `backend/trackingService.js`

## Production Considerations

1. **Redis for Rate Limiting**: The current implementation uses in-memory storage. For production with multiple server instances, use Redis:
   ```typescript
   // Replace rateLimitStore Map with Redis client
   import { Redis } from '@upstash/redis';
   const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
   ```

2. **Email Digest**: For high-traffic sites, implement hourly digests instead of per-event emails to avoid overwhelming the admin inbox.

3. **Data Retention**: Consider adding a cleanup mechanism for old rate limit entries.

4. **Domain Verification**: Ensure your sender domain is verified in Resend to avoid spam filters.

## Compliance Notes

- **GDPR**: The system provides granular consent controls and records consent decisions with timestamps
- **CCPA**: Users can reject all tracking, and anonymized analytics are still collected
- **Data Minimization**: Only necessary data is collected and sent via email
- **Right to be Forgotten**: Since no database is used, data is only stored in emails

## Troubleshooting

### Emails not sending
- Check `RESEND_API_KEY` is correct
- Verify sender domain in Resend dashboard
- Check `ADMIN_EMAIL` is valid
- Check server logs for errors

### Banner not showing
- Clear localStorage and cookies
- Check browser console for errors
- Verify `DataCollectionProvider` is in layout

### Rate limiting errors
- Wait 1 minute between requests during testing
- Adjust rate limit settings in `route.ts`

### IP geolocation not working
- ip-api.com may have rate limits
- Check network connectivity
- Fallback to "Unknown" location is automatic
