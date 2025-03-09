import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Gateway extends BaseModel {
  @column({ isPrimary: true })
  declare gateway_id: number

  @column()
  declare name: string

  @column()
  declare url: string

  @column()
  declare is_active: boolean

  @column()
  declare priority: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
