import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import Gateway from './gateway.js'
import Client from './client.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare transaction_id: number

  @column()
  declare gateway_id: number

  @belongsTo(() => Gateway, { foreignKey: 'gateway_id' })
  declare gateway: BelongsTo<typeof Gateway>

  @column()
  declare client_id: number

  @belongsTo(() => Client, { foreignKey: 'client_id' })
  declare client: BelongsTo<typeof Client>

  @column()
  declare external_id: string

  @column()
  declare amount: number

  @column()
  declare status: 'paid' | 'refunded'

  @column()
  declare card_last_numbers: number

  @manyToMany(() => Product, {
    localKey: 'transaction_id',
    pivotForeignKey: 'transaction_id',
    relatedKey: 'product_id',
    pivotRelatedForeignKey: 'product_id',
    pivotTable: 'transaction_products',
    pivotColumns: ['quantity'],
  })
  declare products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
