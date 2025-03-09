import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await db.table('roles').multiInsert([
      {
        name: 'ADMIN',
      },
      {
        name: 'MANAGER',
      },
      {
        name: 'FINANCE',
      },
      {
        name: 'USER',
      },
    ])
  }
}
