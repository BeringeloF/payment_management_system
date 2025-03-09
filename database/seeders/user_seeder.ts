import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'normal@user.com',
        password: 'test1234',
      },
      {
        email: 'manager@user.com',
        password: 'test1234',
        role_id: 2,
      },
      {
        email: 'finance@user.com',
        password: 'test1234',
        role_id: 3,
      },
      {
        email: 'admin@user.com',
        password: 'test1234',
        role_id: 1,
      },
      {
        email: 'other@user.com',
        password: 'test1234',
      },
    ])
  }
}
