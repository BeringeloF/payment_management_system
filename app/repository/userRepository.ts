import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import type { AccessToken } from '@adonisjs/auth/access_tokens'

class UserRepository {
  public db
  constructor() {
    this.db = db
  }

  async create(data: any) {
    try {
      const user = await User.create(data)
      const token = await this.createToken(user)
      return [user, token]
    } catch (err) {
      throw err
    }
  }

  async createToken(user: User) {
    const token: AccessToken = await User.accessTokens.create(user)
    return token
  }
  async findAll() {
    try {
      const users: User[] = await User.all()
      return users
    } catch (err) {
      throw err
    }
  }

  async findById(userId: number) {
    try {
      const user: User | null = await User.findOrFail(userId)
      return user
    } catch (err) {
      throw err
    }
  }

  async update(userId: number, data: any) {
    try {
      const user = await User.findOrFail(userId)

      user.email = data.email || user.email
      if (data.password) user.password = data.password
      await user.save()
      return user
    } catch (err) {
      throw err
    }
  }

  async delete(userId: number) {
    try {
      const user = await User.findOrFail(userId)

      await user.delete()
    } catch (err) {
      throw err
    }
  }
}

export default UserRepository
