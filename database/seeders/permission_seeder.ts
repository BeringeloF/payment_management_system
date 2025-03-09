import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await db.rawQuery(`INSERT INTO permissions  (action, context) VALUES('read', 'users'), ('create', 'users'), 
('update', 'users'),('delete', 'users'), ('read', 'products'), ('create', 'products'), ('update', 'products'),
('delete', 'products'),  ('refund', 'transactions'), ('all', 'all')
`)
  }
}
