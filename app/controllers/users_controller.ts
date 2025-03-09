import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import UserPolicy from '#policies/user_policy'
import { deleteUserValidator, getUserValidator, updateUserValidator } from '#validators/user'
import UserRepository from '../repository/userRepository.js'

const userRepository = new UserRepository()

export default class UsersController {
  public async index({ response }: HttpContext) {
    try {
      const users: User[] = await userRepository.findAll()
      return response.status(200).json({ results: users.length, data: users })
    } catch (err) {
      throw err
    }
  }

  public async show({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(getUserValidator)
      const user: User = await userRepository.findById(payload.params.userId)

      return response.status(200).json({ data: user })
    } catch (err) {
      throw err
    }
  }

  public async update({ request, response, bouncer }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateUserValidator)

      if (await bouncer.with(UserPolicy).denies('modify', payload.params.userId)) {
        throw new Exception(
          'Permission Denied, make sure this user exists and you have a superior role',
          {
            status: 403,
            code: 'E_PERMISSION_DENIED',
          }
        )
      }
      const user = await userRepository.update(payload.params.userId, payload)

      user.email = payload.email || user.email
      if (payload.password) user.password = payload.password
      await user.save()
      return response.status(200).json({ data: user })
    } catch (err) {
      throw err
    }
  }

  public async destroy({ request, response, bouncer }: HttpContext) {
    try {
      const payload = await request.validateUsing(deleteUserValidator)
      if (await bouncer.with(UserPolicy).denies('modify', payload.params.userId)) {
        throw new Exception(
          'Permission Denied, make sure this user exists and you have a superior role',
          {
            status: 403,
            code: 'E_PERMISSION_DENIED',
          }
        )
      }
      await userRepository.delete(payload.params.userId)

      return response.status(204).json({ data: null })
    } catch (err) {
      throw err
    }
  }
}
