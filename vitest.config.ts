/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
		exclude: ["node_modules", "tests/e2e/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.d.ts",
				"src/app/**/layout.tsx",
				"src/env.ts",
				"src/types/**",
			],
		},
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
})
