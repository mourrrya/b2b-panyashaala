# Constants Module

This directory contains all centralized constants, configuration values, and hard-coded strings used throughout the application.

## Directory Structure

```
lib/constants/
├── index.ts          # Complete index export (includes utilities)
├── config.ts         # Site configuration, contact info, social media
├── navigation.ts     # Navigation links (header and footer)
├── products.ts       # Product categories and descriptions
├── auth.ts           # Authentication, API, and Turnstile config
├── messages.ts       # Error and success messages
├── ui-labels.ts      # All UI labels and text content
├── marketing.ts      # Marketing copy and feature highlights
├── content.ts        # Page content (about, quality, FAQ)
├── metadata.ts       # SEO keywords, page metadata, schema config
├── http.ts           # HTTP status codes
├── routes.ts         # Route definitions and URL helpers
├── errors.ts         # Error handling utilities
├── validation.ts     # Validation rules and form validation helpers
├── seo.ts            # SEO configuration and metadata
├── applications.ts   # Application category enums and types
└── README.md         # This file
```

## Usage

### Importing Constants

```typescript
// Import multiple constants from index export
import { SITE_CONFIG, ERROR_MESSAGES, NAV_LINKS } from "@/lib/constants";

// Or import from specific files for better tree-shaking
import { NAVIGATE } from "@/lib/constants/navigation";
import { AUTH_CONFIG, API_CONFIG } from "@/lib/constants/auth";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants/messages";
import { UI_LABELS } from "@/lib/constants/ui-labels";
import { API_ROUTES } from "@/lib/constants/routes";
import { VALIDATION_RULES } from "@/lib/constants/validation";
import { PAGE_SEO } from "@/lib/constants/seo";
```

### Main Categories

#### Site Configuration (`SITE_CONFIG`)

```typescript
import { SITE_CONFIG } from "@/lib/constants";

console.log(SITE_CONFIG.NAME); // "Aukra Chem Essentials LLP"
console.log(SITE_CONFIG.URL); // "https://aukra.co.in"
```

#### Error Messages (`ERROR_MESSAGES`)

```typescript
import { ERROR_MESSAGES } from "@/lib/constants";

throw new Error(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
throw new Error(ERROR_MESSAGES.VALIDATION.EMAIL_REQUIRED);
throw new Error(ERROR_MESSAGES.TURNSTILE.NETWORK_ERROR);
```

#### UI Labels (`UI_LABELS`)

```typescript
import { UI_LABELS } from '@/lib/constants';

<button>{UI_LABELS.ACTIONS.SEND_ENQUIRY}</button>
<h1>{UI_LABELS.HEADERS.HOME_TITLE}</h1>
<label>{UI_LABELS.FORM.EMAIL}</label>
<input placeholder={UI_LABELS.PLACEHOLDERS.SEARCH_PRODUCTS} />
```

#### Routes & API Configuration

```typescript
import { PUBLIC_ROUTES, PRIVATE_ROUTES, SWR_CONFIG } from "@/lib/constants/routes";

// API routes for data fetching
const { data } = useSWR(PUBLIC_ROUTES.PRODUCTS.LIST, swrFetcher, SWR_CONFIG);
const response = await apiClient.get(PRIVATE_ROUTES.PROFILE);

// Dynamic route builder
const detailUrl = PUBLIC_ROUTES.PRODUCTS.DETAIL(productId);
const orderUrl = PRIVATE_ROUTES.ORDERS.DETAIL(orderId);
```

#### Validation

```typescript
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "@/lib/constants/validation";

// In Zod schema
const schema = z.object({
  password: z.string().min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN),
});
```

#### SEO Configuration

```typescript
import { PAGE_SEO, META_KEYWORDS } from "@/lib/constants/seo";

export const metadata: Metadata = {
  title: PAGE_SEO.HOME.title,
  description: PAGE_SEO.HOME.description,
  keywords: META_KEYWORDS.HOME,
};
```

## File Descriptions

### `index.ts`

The main constants file containing:

- **SITE_CONFIG**: Website configuration (URL, name, description, logos)
- **CONTACT_INFO**: Phone numbers, emails
- **SOCIAL_HANDLES**: Social media handles
- **NAV_LINKS**: Navigation menu items
- **PRODUCT_CATEGORIES**: Product category definitions
- **AUTH_CONFIG**: Authentication settings
- **API_CONFIG**: API configuration
- **ERROR_MESSAGES**: All error message strings
- **SUCCESS_MESSAGES**: Success notification strings
- **UI_LABELS**: Button labels, form labels, headers
- **MARKETING_COPY**: Marketing text and taglines
- **FEATURE_HIGHLIGHTS**: Feature cards data
- **FAQ_DATA**: FAQ questions and answers
- **HTTP_STATUS**: HTTP status code constants

### `routes.ts`

Route and API configuration constants:

- **PUBLIC_ROUTES**: Public API endpoints (`/products`, `/categories` etc.)
- **PRIVATE_ROUTES**: Protected API endpoints (`/profile`, `/orders`)
- **SWR_CONFIG**: Global SWR configuration (deduplication, retry, revalidation)
- **EXTERNAL_LINKS**: Third-party service URLs

### `navigation.ts`

Navigation-related constants (**single source of truth for all page navigation and page navigation protection**):

- **PUBLIC_NAV**: Client-side page routes (home, products, about, etc.)
- **PRIVATE_NAV**: Client-side protected page routes (profile, orders, etc.)
- **CATEGORY_ROUTES**: Product category filter routes (derived from `PUBLIC_NAV.PRODUCTS`)
- **NAV_LINKS**: Main navigation menu items
- **FOOTER_LINKS**: Footer navigation links (uses `CATEGORY_ROUTES` and `PUBLIC_NAV`)
- **BREADCRUMBS**: Breadcrumb definitions (uses `PUBLIC_NAV`)
- **NAVIGATION_CONFIG**: Route protection, auth-only, and robots disallow settings
  - `AUTH_CONFIG.PROTECTED_PAGES` and `AUTH_CONFIG.AUTH_PAGE` reference this — **do not duplicate**
  - `API_CONFIG.ROBOTS_DISALLOW` references this — **do not duplicate**

### `errors.ts`

Error handling utilities:

- Re-exports ERROR_MESSAGES and HTTP_STATUS
- **decodeOAuthError()**: Decode OAuth error codes to user-friendly messages
- **getTurnstileErrorMessage()**: Get Turnstile-specific error messages

### `validation.ts`

Validation configuration:

- **VALIDATION_RULES**: Min/max lengths, regex patterns
- **FILE_UPLOAD_RULES**: File size and type restrictions
- **VALIDATION_MESSAGES**: Error messages for form fields
- **getFormValidationMessage()**: Helper to get validation messages

### `seo.ts`

SEO configuration:

- **SEO_DEFAULTS**: Default meta robots, OG image dimensions
- **META_KEYWORDS**: Keywords grouped by page
- **PAGE_SEO**: Complete SEO config per page
- **SCHEMA_TYPES**: Schema.org type constants

### `applications.ts`

Application-specific enums:

- **ApplicationCategory**: Enum of application categories
- **Application**: Type definition for application objects

## Best Practices

1. **Always use constants for strings that appear in multiple places**
2. **Group related constants together** in appropriate category objects
3. **Use TypeScript `as const`** for type safety and autocomplete
4. **Document new constants** with JSDoc comments when adding
5. **Prefer specific imports** over importing everything for better tree-shaking

## Adding New Constants

When adding new constants:

1. Identify the appropriate category/file
2. Add the constant with a descriptive name
3. Use SCREAMING_SNAKE_CASE for constant names
4. Add JSDoc comment if the purpose isn't obvious
5. Export from index.ts if needed for external use

Example:

```typescript
// In index.ts
export const MY_NEW_CONFIG = {
  /** Description of what this setting does */
  SETTING_NAME: "value",
} as const;
```

## Migration Guide

When migrating existing hard-coded strings to use constants:

1. Search for the hard-coded string
2. Find or create the appropriate constant
3. Import the constant in your file
4. Replace the hard-coded string with the constant
5. Test that everything works correctly

Example migration:

```typescript
// Before
throw new Error("Invalid request");

// After
import { ERROR_MESSAGES } from "@/lib/constants";
throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_REQUEST);
```
