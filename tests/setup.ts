/**
 * Global test setup for Vitest.
 *
 * Runs before all test files. Sets up DOM testing utilities
 * and any global mocks.
 */

import "@testing-library/jest-dom/vitest";

// Mock environment variables for tests
Object.assign(process.env, {
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  NEXTAUTH_SECRET: "test-secret-at-least-32-characters-long",
  NEXTAUTH_URL: "http://localhost:3000",
  NODE_ENV: "test",
  NEXT_PUBLIC_APP_NAME: "Test App",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
});
