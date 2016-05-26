/**
 * DB Service
 * For Redis
 */


import { createClient } from 'then-redis'

// Use the default config
const client = createClient()


export {
    client
}
