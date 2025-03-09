import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await db.rawQuery(`
      INSERT INTO roles_permissions (role_id, permission_id) VALUES(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
     (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (1, 10) `)
  }
}
