/**
 * Auth.js API route handler.
 *
 * Handles all /api/auth/* requests (sign in, sign out, callbacks, etc.)
 */

import { handlers } from "@/lib/auth/config"

export const { GET, POST } = handlers
