import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
	dialect: 'postgresql',
	schema: './db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		// connectionString: process.env.DATABASE_URL!,
		url: process.env.DATABASE_URL!,
	},
} satisfies Config
// satisfies Config

// import { defineConfig } from 'drizzle-kit'
// driver: 'pg',
