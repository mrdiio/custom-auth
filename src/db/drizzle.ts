import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { config } from 'dotenv'
import { Pool } from 'pg'

config({ path: '.env' })

export const client = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

export const db = drizzle(client, { schema })

// export const db = drizzle({
//   schema,
//   connection: {
//     password: process.env.DB_PASSWORD,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//   },
// })
