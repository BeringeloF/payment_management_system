import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('ts_id')
      table
        .integer('transaction_id')
        .unsigned()
        .references('transaction_id')
        .inTable('transactions')
        .notNullable()
      table
        .integer('product_id')
        .unsigned()
        .references('product_id')
        .inTable('products')
        .notNullable()
      table.integer('quantity').notNullable()
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at').defaultTo(this.now()).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
