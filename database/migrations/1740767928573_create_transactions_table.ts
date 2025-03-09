import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('transaction_id')
      table
        .integer('gateway_id')
        .unsigned()
        .references('gateway_id')
        .inTable('gateways')
        .onDelete('CASCADE')
      table.integer('client_id').unsigned().references('client_id').inTable('clients').notNullable()
      table.string('external_id').notNullable()
      table.integer('amount').notNullable()
      table.enum('status', ['paid', 'refunded']).notNullable().defaultTo('paid')
      table.integer('card_last_numbers').notNullable()
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at').defaultTo(this.now()).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
