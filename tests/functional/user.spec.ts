import { test } from '@japa/runner'

const emails = ['normal@user.com', 'manager@user.com', 'finance@user.com', 'admin@user.com']

const login = (i: number) => {
  return emails[i]
}

test.group('Users Intregation Tests', () => {
  test('POST /register should register an user', async ({ client, assert }) => {
    const user = {
      email: 'albert@email.com',
      password: 'test1234',
    }
    const response = await client.post('/register').json(user)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(201)
    assert.equal(response.body().data.email, user.email)
    assert.isString(response.body().accessToken.token)
  })

  test('POST /login should login an user', async ({ client, assert }) => {
    const user = {
      email: login(0),
      password: 'test1234',
    }
    const response = await client.post('/login').json(user)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isString(response.body().accessToken.token)
  })

  test('GET /users should get all users', async ({ client, assert }) => {
    const user = {
      email: login(1),
      password: 'test1234',
    }

    const token = (await client.post('/login').json(user)).body().accessToken.token

    console.log(token)

    const response = await client.get('/users').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isArray(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('GET /users should not get if user is not authorized', async ({ client }) => {
    const user = {
      email: login(2),
      password: 'test1234',
    }

    const token = (await client.post('/login').json(user)).body().accessToken.token

    const response = await client.get('/users').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(403)
  })

  test('GET /users/:userId should get a specific user', async ({ client, assert }) => {
    const user = {
      email: login(1),
      password: 'test1234',
    }

    const token = (await client.post('/login').json(user)).body().accessToken.token

    const response = await client.get('/users/1').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('PATCH /users/:userId should update user', async ({ client, assert }) => {
    const user = {
      email: login(1),
      password: 'test1234',
    }

    const token = (await client.post('/login').json(user)).body().accessToken.token

    const jsonData = {
      email: 'albertNew@email.com',
    }

    const response = await client
      .patch('/users/3')
      .header('Authorization', `Bearer ${token}`)
      .json(jsonData)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.equal(response.body().data.email, jsonData.email)
    assert.isNotEmpty(response.body().data)
  })

  test('DELETE /users/:userId should delete user', async ({ client, assert }) => {
    const user = {
      email: login(1),
      password: 'test1234',
    }

    const token = (await client.post('/login').json(user)).body().accessToken.token

    const response = await client.delete('/users/1').header('Authorization', `Bearer ${token}`)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(204)

    assert.isNotOk(response.body().data)
  })
})
