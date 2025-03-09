import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { registerUserValidator, loginUserValidator } from '#validators/user'
import UserRepository from '../repository/userRepository.js'

const userRepository = new UserRepository()

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(loginUserValidator)
      const email = data.email
      const password = data.password
      console.log(data)
      const user: User = await User.verifyCredentials(email, password)
      const token: AccessToken = await userRepository.createToken(user)

      return response.status(200).json({ accessToken: token })
    } catch (err) {
      throw err
    }
  }

  public async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerUserValidator)
      const data = {
        email: payload.email,
        password: payload.password,
        ...(payload.roleId ? { role_id: payload.roleId } : {}),
      }

      const [user, token] = await userRepository.create(data)

      return response.status(201).json({ accessToken: token, data: user })
    } catch (err) {
      throw err
    }
  }
}
