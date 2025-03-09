import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().references('role_id').inTable('roles').onDelete('CASCADE')
      table
        .integer('permission_id')
        .unsigned()
        .references('permission_id')
        .inTable('permissions')
        .onDelete('CASCADE')
      table.unique(['permission_id', 'role_id'])
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at').defaultTo(this.now()).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
