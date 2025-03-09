import { test } from '@japa/runner'
import login from '#tests/utilsTest/login'

test.group('Products Intregation Tests', () => {
  test('GET /products should get all products', async ({ assert, client }) => {
    const token = await login('finance', client)
    const response = await client.get('/products').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isArray(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('GET /products/:productId should get a specific product', async ({ assert, client }) => {
    const token = await login('finance', client)
    const response = await client.get('/products/1').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('GET /products/:productId should get a specific product if admin', async ({
    assert,
    client,
  }) => {
    const token = await login('admin', client)
    const response = await client.get('/products/1').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('GET /products/:productId should not get a specific product if not authorized', async ({
    client,
  }) => {
    const token = await login('user', client)
    const response = await client.get('/products/1').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(403)
  })

  test('POST /products should create a product', async ({ client, assert }) => {
    const jsonData = {
      name: 'pants',
      amount: 92,
    }
    const token = await login('manager', client)
    const response = await client
      .post('/products')
      .header('Authorization', `Bearer ${token}`)
      .json(jsonData)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(201)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('PATCH /products/:productId should update a product', async ({ assert, client }) => {
    const token = await login('manager', client)

    const jsonData = {
      amount: 100,
    }
    const response = await client
      .patch('/products/1')
      .header('Authorization', `Bearer ${token}`)
      .json(jsonData)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
    assert.equal(jsonData.amount, response.body().data.amount)
  })

  test('DELETE /products/:productId should delete a product', async ({ assert, client }) => {
    const token = await login('manager', client)

    const response = await client.delete('/products/1').header('Authorization', `Bearer ${token}`)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(204)

    assert.isNotOk(response.body().data)
  })
})
