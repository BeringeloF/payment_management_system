import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      {
        name: 'shoes',
        amount: 89,
      },
      {
        name: 'shirt',
        amount: 50,
      },
    ])
  }
}
