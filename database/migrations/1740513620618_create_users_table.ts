import { BaseSchema } from '@adonisjs/lucid/schema'
import env from '#start/env'

const defaultRole = Number(env.get('DEFAULT_ROLE'))

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_id').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table
        .integer('role_id')
        .unsigned()
        .references('role_id')
        .inTable('roles')
        .onDelete('CASCADE')
        .notNullable()
        .defaultTo(defaultRole)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
