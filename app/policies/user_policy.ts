import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { getUserRole } from '../utils.js'
export default class UserPolicy extends BasePolicy {
  async modify(user: User, userId: number) {
    try {
      if (user.user_id === userId) return true
      const [myRole, userToBeUpdateRole] = await getUserRole([user.user_id, userId])

      console.log(myRole, userToBeUpdateRole)
      if (!userToBeUpdateRole) return false

      if (userToBeUpdateRole.name === 'ADMIN') return false
      if (myRole.name === 'ADMIN') return true
      if (myRole.name === userToBeUpdateRole.name) return false
      return true
    } catch (err) {
      throw err
    }
  }
}
