import { test } from '@japa/runner'
import sinon from 'sinon'
import type { HttpContext } from '@adonisjs/core/http'
import UsersController from '#controllers/users_controller'
import UserRepository from '../../app/repository/userRepository.js'
import AuthController from '#controllers/auth_controller'
import User from '#models/user'

test.group('UsersController Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })

  test('should get all users', async ({ assert }) => {
    const fakeUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]

    sinon.stub(UserRepository.prototype, 'findAll').resolves(fakeUsers as any)

    const ctx = {
      response: {
        status(statusCode: number) {
          console.log(statusCode)
          return this
        },
        json: (payload: any) => payload,
      },
    } as unknown as HttpContext

    const controller = new UsersController()
    const result = await controller.index(ctx)

    assert.deepEqual(result, { results: fakeUsers.length, data: fakeUsers })
  })

  test('should get a specific user', async ({ assert }) => {
    const fakeUser = { id: 1, email: 'alice@gmail.com', password: 'pass', save() {} }

    sinon.stub(UserRepository.prototype, 'findById').resolves(fakeUser as any)

    const ctx = {
      request: {
        validateUsing() {
          return {
            params: {
              userId: 1,
            },
          }
        },
      },
      boucer: {
        with() {
          return this
        },
        denies() {
          return false
        },
      },
      response: {
        status(statusCode: number) {
          console.log(statusCode)
          return this
        },
        json: (payload: any) => payload,
      },
    } as unknown as HttpContext

    const controller = new UsersController()
    const result = await controller.show(ctx)

    assert.deepEqual(result, { data: fakeUser })
  })

  test('should update an user', async ({ assert }) => {
    const fakeUser = { id: 1, email: 'alice@email.com', password: 'pass', save() {} }

    sinon.stub(UserRepository.prototype, 'update').resolves(fakeUser as any)

    const ctx = {
      request: {
        validateUsing() {
          return {
            email: fakeUser.email,
            params: {
              userId: 1,
            },
          }
        },
      },
      bouncer: {
        with() {
          return this
        },
        denies() {
          return false
        },
      },
      response: {
        status(statusCode: number) {
          console.log(statusCode)
          return this
        },
        json: (payload: any) => payload,
      },
    } as unknown as HttpContext

    const controller = new UsersController()
    const result = await controller.update(ctx)

    assert.deepEqual(result, { data: fakeUser })
  })

  test('should delete an user', async ({ assert }) => {
    sinon.stub(UserRepository.prototype, 'delete').resolves(null as any)

    const ctx = {
      request: {
        validateUsing() {
          return {
            params: {
              userId: 1,
            },
          }
        },
      },
      bouncer: {
        with() {
          return this
        },
        denies() {
          return false
        },
      },
      response: {
        status(statusCode: number) {
          console.log(statusCode)
          return this
        },
        json: (payload: any) => payload,
      },
    } as unknown as HttpContext

    const controller = new UsersController()
    const result = await controller.destroy(ctx)

    assert.deepEqual(result, { data: null })
  })
})

test.group('AuthController Unit Test', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })

  test('should register an user', async ({ assert }) => {
    const fakeUser = { id: 1, email: 'alice@email.com', password: 'pass', save() {} }
    const ctx = {
      request: {
        validateUsing() {
          return {
            email: fakeUser.email,
            password: fakeUser.password,
            params: {
              userId: 1,
            },
          }
        },
      },
      bouncer: {
        with() {
          return this
        },
        denies() {
          return false
        },
      },
      response: {
        status(statusCode: number) {
          console.log(statusCode)
          return this
        },
        json: (payload: any) => payload,
      },
    } as unknown as HttpContext
    sinon.stub(UserRepository.prototype, 'create').resolves([fakeUser, 'token'] as any)
    const controller = new AuthController()
    const result = await controller.register(ctx)

    assert.deepEqual(result, { accessToken: 'token', data: fakeUser })
  })

  test('should login', async ({ assert }) => {
    const fakeUser = { id: 1, email: 'alice@email.com', password: 'pass', save() {} }
    const ctx = {
      request: {
        validateUsing() {
          return {
            email: fakeUser.email,
            password: fakeUser.password,
            params: {
              userId: 1,
            },
          }
        },
      },
      bouncer: {
        with() {
          return this
        },
        denies() {
          return false
        },
      },
      response: {
        status(statusCode: number) {
          console.log(statusCode)
          return this
        },
        json: (payload: any) => payload,
      },
    } as unknown as HttpContext
    sinon.stub(User, 'verifyCredentials').resolves(fakeUser as any)
    sinon.stub(UserRepository.prototype, 'createToken').resolves('token' as any)
    const controller = new AuthController()
    const result = await controller.login(ctx)

    assert.deepEqual(result, { accessToken: 'token' })
  })
})

test.group('UserRepository Unit Test', (group) => {
  //i am only implementing test on methods that have some real logic in it, and not on the ones that only make one method/function call
  group.each.teardown(async () => {
    sinon.restore()
  })
  test('should update an user R', async ({ assert }) => {
    const fakeUser = { id: 1, email: 'alice@email.com', password: 'pass', save() {} }

    const updatedUser = { id: 1, email: 'alice@outlook.com', password: 'pass', save() {} }

    sinon.stub(User, 'findOrFail').resolves(fakeUser as any)

    const repository = new UserRepository()
    const result = await repository.update(1, updatedUser)

    assert.deepEqual(result.email, updatedUser.email)
  })
})
