import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { config } from 'dotenv'

config({ path: '.env' })

// export const client = new Pool({
//   host: 'dev-nextjs.cxio4yoay8am.ap-southeast-3.rds.amazonaws.com',
//   port: 5432,
//   user: 'postgres',
//   password: 'UntanMulia-2020',
//   database: 'custom-auth-nextjs',
// })

// export const db = drizzle(client, { schema })

export const db = drizzle({
  schema,
  connection: {
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
})
