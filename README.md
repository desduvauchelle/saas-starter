# SaaS Starter

An opinionated Next.js 15 SaaS boilerplate with everything you need to launch a startup — authentication, payments, admin dashboard, blog, email, file storage, and more. TypeScript strict mode, zero `any`.

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript (strict, no `any`) |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | Auth.js v5 (NextAuth) with env-driven OAuth providers |
| **Payments** | Stripe (subscriptions, one-time, webhooks, customer portal) |
| **Email** | Resend |
| **Storage** | Vercel Blob or AWS S3 (swappable via env) |
| **Styling** | Tailwind CSS v4 + DaisyUI v5 |
| **Icons** | FontAwesome |
| **Validation** | Zod (env vars, API inputs, blog frontmatter) |
| **Testing** | Vitest + Testing Library + Playwright |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local, Docker, or hosted like Supabase/Neon)

### Setup

```bash
# Clone and install
git clone <repository-url>
cd <repository-name>
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Set up database
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate Prisma client

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

Create a `.env` file in the project root. All variables are validated at startup via Zod — the app will tell you exactly what's missing.

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/mydb`) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical URL of the app (e.g. `http://localhost:3000`) |

### OAuth Providers (optional — presence enables the provider)

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `APPLE_CLIENT_ID` | Apple OAuth client ID |
| `APPLE_CLIENT_SECRET` | Apple OAuth client secret |
| `MAGIC_LINK_ENABLED` | Set to `"true"` to enable magic-link login (requires email config) |

### Email

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `EMAIL_FROM` | Sender address (e.g. `noreply@yourdomain.com`) |

### Stripe

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`) — exposed to browser |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |

### File Storage (optional — pick one provider)

| Variable | Description |
|----------|-------------|
| `STORAGE_PROVIDER` | `"vercel"` or `"s3"` |

**Vercel Blob:**

| Variable | Description |
|----------|-------------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read-write token |

**AWS S3:**

| Variable | Description |
|----------|-------------|
| `AWS_S3_BUCKET` | S3 bucket name |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region (e.g. `us-east-1`) |

### AI (OpenRouter)

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | OpenRouter API key — required for AI features |
| `OPENROUTER_MODEL` | OpenRouter model ID (e.g. `google/gemini-flash-1.5`) |

### Application

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_NAME` | App name shown in titles, emails, etc. (default: `"SaaS Starter"`) |
| `NEXT_PUBLIC_APP_URL` | Public URL used in emails and OG tags |
| `OWNER_EMAILS` | Comma-separated emails assigned the OWNER role on first login |
| `ADMIN_EMAILS` | Comma-separated emails assigned the ADMIN role on first login |

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public pages (landing, blog, legal, contact)
│   ├── (auth)/                   # Auth pages (login, register, forgot/reset password)
│   ├── (app)/                    # Authenticated app pages (dashboard, account)
│   ├── admin/                    # Admin dashboard (users, blog, products, subscriptions)
│   └── api/
│       ├── ai/                   # AI endpoints (streaming chat, typed templates)
│       ├── auth/                 # Auth endpoints (register, forgot/reset password, NextAuth)
│       ├── account/              # Account management (profile, avatar, password, delete)
│       ├── admin/                # Admin CRUD (users, blog, products, subscriptions)
│       ├── billing/              # Stripe (checkout, portal, webhooks)
│       ├── contact/              # Contact form handler
│       └── storage/              # File upload endpoint
├── components/
│   ├── admin/                    # Admin components (ResourceTable, Pagination, PostEditor, etc.)
│   ├── auth/                     # Auth components (LoginForm, RegisterForm, OAuthButtons)
│   ├── billing/                  # PricingTable component
│   └── layout/                   # Layout components (AppNavbar, CookieBanner)
├── lib/
│   ├── ai/                       # AI client, template system, and prompt registry
│   ├── api/                      # API helpers (response, errors, client-side parsers)
│   ├── auth/                     # Auth config and guards (requireAuth, requireRole)
│   ├── blog/                     # Blog parser (frontmatter) and renderer (markdown → HTML)
│   ├── email/                    # Resend client and email templates
│   ├── payment/                  # Stripe client and subscription helpers
│   ├── storage/                  # Storage abstraction (Vercel Blob / S3 providers)
│   └── prisma.ts                 # Prisma client singleton
├── types/                        # Shared TypeScript types (user, blog, billing, storage, auth)
├── env.ts                        # Zod env validation (import `env` instead of `process.env`)
└── middleware.ts                 # Route protection for /app/* and /admin/*
prisma/
└── schema.prisma                 # Database schema (User, Post, Product, Subscription, etc.)
tests/
├── unit/                         # Vitest unit tests
├── e2e/                          # Playwright E2E tests
└── setup.ts                      # Test setup
```

## Key Features

### Authentication

- Email/password registration with bcrypt hashing
- OAuth providers auto-configured from env vars (Google, GitHub, Apple)
- Optional magic-link login
- Middleware-based route protection
- Role-based access: `USER`, `ADMIN`, `OWNER`

### Admin Dashboard

- User management (CRUD, role assignment, activate/deactivate)
- Blog management (create/edit/delete posts)
- Product management (pricing, Stripe sync)
- Subscription overview
- Generic `ResourceTable` component with sorting, filtering, search, and pagination

### Blog

- Markdown files with YAML frontmatter (title, description, keywords, slug)
- Server-side rendering with remark/rehype pipeline
- SEO metadata generation

### Payments (Stripe)

- Subscription and one-time product support
- Checkout sessions and customer portal
- Webhook handler for subscription lifecycle events
- PricingTable component with monthly/yearly toggle

### Email

- Resend integration with inline HTML templates
- Templates: welcome, password reset, verification, subscription confirmation, payment failed, contact form

### File Storage

- Unified API — swap between Vercel Blob and S3 by changing one env var
- Upload endpoint with file type and size validation

### AI Integration (OpenRouter)

- Streaming chat API compatible with Vercel AI SDK
- Typed prompt template system with auto-discovery
- Secure, authenticated endpoints

### Public Pages

- Landing page with hero, features, pricing, testimonials, and CTA sections
- Legal pages: privacy policy, terms of service, cookie policy, GDPR
- Contact form with API endpoint
- GDPR-compliant cookie consent banner

## AI Engine & Templates

The project features a powerful AI layer built on top of the **Vercel AI SDK** with **OpenRouter** as the provider. It provides two main authenticated API endpoints.

### 1. Streaming Chat (`/api/ai/chat`)

A standard streaming endpoint that accepts an array of messages and returns a model response using the data stream protocol.

**Request Body:**

```json
{
  "messages": [
    { "role": "user", "content": "What is the meaning of life?" }
  ]
}
```

### 2. Typed Prompt Templates (`/api/ai/template`)

A more structured approach to AI where logic is encapsulated in templates. Templates handle input validation, message construction, and output parsing.

**Request Body:**

```json
{
  "template": "summarize",
  "input": {
    "text": "Long article content here...",
    "maxWords": 100
  }
}
```

### Adding New Templates

Templates are automatically discovered from `src/lib/ai/templates/`. To add one:

1. Create a new file, e.g., `src/lib/ai/templates/my-task.ts`.
2. Define input/output schemas and prompts:

```ts
import { z } from "zod";
import { defineTemplate } from "./types";

export default defineTemplate({
  name: "my-task",
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  buildMessages: (input) => [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: input.text },
  ],
  parseOutput: (raw) => ({ result: raw }),
});
```

The template will be instantly available at the `/api/ai/template` endpoint via its `name`.

## Scripts

```bash
npm run dev              # Development server (Turbopack)
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
npm run typecheck        # TypeScript type checking (tsc --noEmit)
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:db-push   # Push schema to database (no migration)
npm run test             # Run unit tests (Vitest)
npm run test:ui          # Vitest with browser UI
npm run test:coverage    # Unit tests with coverage report
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:e2e:ui      # Playwright with browser UI
```

## Styling

- **Tailwind CSS v4** with DaisyUI v5 for component styling and theming
- **DaisyUI themes**: `light` (default) and `dark` (prefers-dark)
- **FontAwesome** icons with manual CSS control (imported in `layout.tsx`)
- Global styles in `src/app/globals.css`

## Theming (DaisyUI)

### How it works

Themes are configured in `src/app/globals.css` inside the `@plugin "daisyui"` block:

```css
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

- `--default` marks the fallback theme when no `data-theme` attribute is set.
- `--prefersdark` makes the `dark` theme activate automatically when the user's OS is in dark mode (via the `prefers-color-scheme` media query). Combined, this gives you automatic light/dark switching out of the box with zero JavaScript.

### Choosing a different built-in theme

DaisyUI v5 ships with 35+ themes. Browse and preview them at [daisyui.com/docs/themes](https://daisyui.com/docs/themes/).

To swap themes, edit `globals.css`:

```css
@plugin "daisyui" {
  /* Pick any DaisyUI theme names here */
  themes: cupcake --default, dracula --prefersdark;
}
```

You can list as many themes as you want — only the listed ones are bundled into the CSS output:

```css
@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake, retro, cyberpunk;
}
```

### Creating a custom theme

Define a custom theme directly in `globals.css` using CSS variables. DaisyUI uses [OKLCH](https://oklch.com/) colour values:

```css
@plugin "daisyui" {
  themes: mybrand --default, dark --prefersdark;
}

/* Custom theme definition */
[data-theme="mybrand"] {
  --color-primary: oklch(55% 0.2 240);          /* blue */
  --color-primary-content: oklch(98% 0.01 240);
  --color-secondary: oklch(60% 0.18 320);       /* purple */
  --color-secondary-content: oklch(98% 0.01 320);
  --color-accent: oklch(65% 0.22 150);          /* teal */
  --color-accent-content: oklch(15% 0.05 150);
  --color-neutral: oklch(30% 0.02 240);
  --color-neutral-content: oklch(90% 0.01 240);
  --color-base-100: oklch(100% 0 0);            /* page background */
  --color-base-200: oklch(96% 0.005 240);
  --color-base-300: oklch(90% 0.01 240);
  --color-base-content: oklch(20% 0.02 240);    /* body text */
  --color-info: oklch(70% 0.18 220);
  --color-success: oklch(65% 0.2 150);
  --color-warning: oklch(75% 0.22 80);
  --color-error: oklch(60% 0.25 25);
  --rounded-box: 0.5rem;
  --rounded-btn: 0.375rem;
}
```

### Auto dark / light toggling (no JavaScript)

When `--prefersdark` is set on a theme and no explicit `data-theme` attribute is present on `<html>`, the browser's `prefers-color-scheme` media query controls which theme is shown automatically. This requires **no JavaScript** — just the CSS configuration above.

### User-controlled theme toggle

The `ThemeToggle` component (`src/components/layout/ThemeToggle.tsx`) lets users override the automatic behaviour. It provides three modes:

| Mode | Behaviour |
|------|-----------|
| ☀️ Light | Forces `data-theme="light"` |
| ⚙️ Auto | Removes `data-theme` — falls back to OS preference |
| 🌙 Dark | Forces `data-theme="dark"` |

The choice is persisted in `localStorage` under the key `"theme"`. An inline script injected as the first child of `<body>` in `layout.tsx` reads this value synchronously before the first paint, preventing a light-mode flash on dark-preference users.

The toggle is rendered in the public footer by default. Move or reuse it anywhere by importing it:

```tsx
import { ThemeToggle } from "@/components/layout/ThemeToggle"

// Render it anywhere
<ThemeToggle />
```

To support additional themes in the toggle, update the themes list in `globals.css` and extend the button array in `ThemeToggle.tsx`.

## Path Alias

Use `@/*` to import from `src/*`:

```typescript
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/guards"
import type { UserPublic } from "@/types/user"
```
