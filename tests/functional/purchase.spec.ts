import { test } from '@japa/runner'
import login from '#tests/utilsTest/login'
import doPurchase from '#tests/utilsTest/doPurchase'

test.group('Purchases Intregation Tests', () => {
  test('POST /purchase/buy should make a purchase', async ({ assert, client }) => {
    const jsonData = {
      products: [
        {
          id: 2,
          quantity: 2,
        },
      ],
      name: 'tester',
      email: 'tester@email.com',
      cardNumber: '5569000000006063',
      cvv: '010',
    }
    const response = await client.post('/purchases/buy').json(jsonData)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('POST /purchase/buy should not make a purchase because credit card data is invalid', async ({
    client,
  }) => {
    const jsonData = {
      products: [
        {
          id: 2,
          quantity: 2,
        },
      ],
      name: 'tester',
      email: 'tester@email.com',
      cardNumber: '5569000000006063',
      cvv: '200',
    }
    const response = await client.post('/purchases/buy').json(jsonData)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(400)
  })

  test('GET /purchases should get all purchases', async ({ assert, client }) => {
    const token = await login('user', client)
    const response = await client.get('/purchases').header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isArray(response.body().data)
  })

  test('GET /purchases/transactionId should get purchase details', async ({ assert, client }) => {
    const token = await login('user', client)
    const transactionId = (await doPurchase(client)).transactionId
    const response = await client
      .get(`/purchases/${transactionId}`)
      .header('Authorization', `Bearer ${token}`)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
  })

  test('POST /purchases/refund/transactionId should make the refund', async ({
    assert,
    client,
  }) => {
    const token = await login('finance', client)
    const transactionId = (await doPurchase(client)).transactionId
    const response = await client
      .post(`/purchases/refund/${transactionId}`)
      .header('Authorization', `Bearer ${token}`)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
  })

  test('POST /purchases/refund/transactionId should not make the refund if not authorized', async ({
    client,
  }) => {
    const token = await login('user', client)
    const transactionId = (await doPurchase(client)).transactionId
    const response = await client
      .post(`/purchases/refund/${transactionId}`)
      .header('Authorization', `Bearer ${token}`)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(403)
  })
})
