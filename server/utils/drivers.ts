import pg from 'pg'
import { runtimeConfig } from './runtimeConfig'

const getDatabaseUrl = () => {
  if (runtimeConfig.preset == 'node-server') {
    return runtimeConfig.databaseUrl
  } else {
    return runtimeConfig.databaseUrl
  }
}

const createPgPool = () => new pg.Pool({
  connectionString: getDatabaseUrl(),
  max: 90,
  idleTimeoutMillis: 30000
})

let pgPool: pg.Pool

// PG Pool
export const getPgPool = () => {
  if (runtimeConfig.preset == 'node-server') {
    if (!pgPool) {
      pgPool = createPgPool()
    }
    return pgPool
  } else {
    return createPgPool()
  }
}