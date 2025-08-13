# SaaS Starter - Copilot Instructions

## Project Overview

This is an opinionated Next.js 15 SaaS starter template designed for rapid development with built-in infrastructure for common SaaS features. The project emphasizes developer productivity by pre-configuring essential integrations.

## Architecture & Stack

- **Framework**: Next.js 15 with App Router, TypeScript, and Turbopack for development
- **Styling**: Tailwind CSS v4 with DaisyUI component library
- **Icons**: FontAwesome with manual CSS control (config.autoAddCss = false)
- **Database**: MongoDB (via `src/lib/db/` - placeholder for connection logic)
- **Payment**: Stripe integration (via `src/lib/payment/`)
- **Email**: Resend service (via `src/lib/email/`)
- **Storage**: Multi-provider support - Google Cloud Storage, AWS S3, or local (via `src/lib/storage/`)
- **Auth**: Custom authentication system (via `src/lib/auth/`)

## Directory Structure & Conventions

### Core Application Structure
```
src/app/              # Next.js App Router pages
├── api/              # API routes (auth, blog, etc.)
├── admin/            # Admin dashboard pages
├── blog/             # Blog-related pages
├── setup/            # Initial app configuration pages
src/lib/              # Business logic and integrations
├── db/               # Database models and connection
├── auth/             # Authentication utilities
├── payment/          # Stripe payment processing
├── email/            # Email sending logic
├── storage/          # File storage abstraction layer
src/components/       # Reusable React components
src/hooks/            # Custom React hooks
src/tools/            # Utility scripts and tools
```

### Path Alias
- Use `@/*` for importing from `src/*` (configured in tsconfig.json)

## Development Guidelines

### Environment Configuration
- **Required Variables**: `MONGODB_URI`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`
- **Storage Provider Variables**: Configure one of:
  - Google Cloud: `GOOGLE_CLOUD_STORAGE_BUCKET`
  - AWS S3: `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
  - Local: `LOCAL_STORAGE_PATH`

### Styling Approach
- Use Tailwind CSS v4 with DaisyUI themes (`light --default, dark --prefersdark`)
- DaisyUI components are available for rapid UI development
- FontAwesome icons are imported with manual CSS control in `layout.tsx`
- Global styles in `src/app/globals.css` use modern @import syntax

### Development Commands
- `npm run dev`: Development server with Turbopack for faster builds
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run lint`: ESLint with Next.js and TypeScript rules

### Code Organization Patterns
- **Service Layer**: Business logic in `src/lib/` with clear separation by domain
- **Multi-Provider Architecture**: Storage and potentially other services support multiple providers
- **Setup Flow**: Dedicated setup pages for initial app configuration
- **Admin Dashboard**: Separate admin section for management features

### Key Integrations
- **Database**: MongoDB integration via dedicated connection layer
- **Authentication**: Custom auth system (not using NextAuth or similar)
- **Payments**: Stripe for subscription and payment processing
- **Email**: Resend for transactional emails
- **File Storage**: Abstracted to support cloud and local storage options

### Development Best Practices
- Use TypeScript strict mode for all files
- Follow Next.js App Router patterns for server/client components
- Leverage Turbopack for development performance
- Implement proper error boundaries and loading states
- Use DaisyUI components for consistent UI/UX

## Project Philosophy

This starter prioritizes developer velocity over flexibility. It makes opinionated choices to reduce setup time and provides a foundation that can be extended rather than configured from scratch. The modular `src/lib/` structure allows easy swapping of providers while maintaining consistent interfaces.
