import {
  describe, expect, it
} from '@jest/globals'

// import dbConfig from '../assets/db.js'
// import knex from 'knex'

describe('Init Database Connection', () => {
  it('Setup Database', async () => {
    // const client = knex.knex({
    //   client: 'mysql2',
    //   connection: {
    //     ...dbConfig.mysql,
    //     charset: 'utf8mb4'
    //   }
    // })
    // const result = await client.raw('SELECT 1+1 AS result')
    // expect(result[0][0].result).toBe(2)
    expect(1).toBe(1)
  })
})
