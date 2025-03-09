import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare product_id: number

  @column()
  declare name: string

  @column()
  declare amount: number

  @manyToMany(() => Transaction, {
    localKey: 'product_id',
    pivotForeignKey: 'product_id',
    relatedKey: 'transaction_id',
    pivotRelatedForeignKey: 'transaction_id',
    pivotTable: 'transaction_products',
    pivotColumns: ['quantity'],
  })
  declare transactions: ManyToMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
