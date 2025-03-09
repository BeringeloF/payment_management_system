import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'
export default class extends BaseSeeder {
  async run() {
    await Gateway.createMany([
      {
        name: 'firstGateway',
        priority: 1,
      },
      {
        name: 'secondGateway',
        priority: 2,
      },
    ])
  }
}
