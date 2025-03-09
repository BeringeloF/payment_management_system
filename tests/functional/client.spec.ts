import { test } from '@japa/runner'
import login from '#tests/utilsTest/login'
import doPurchase from '#tests/utilsTest/doPurchase'

test.group('Client Integration Test', () => {
  test('GET /clients should get all clients', async ({ assert, client }) => {
    const token = await login('user', client)

    const response = await client.get('/clients').header('Authorization', `Bearer ${token}`)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isArray(response.body().data)
    assert.isNumber(response.body().results)
  })

  test('GET /clients/:clientId should get client information and his purchases details', async ({
    assert,
    client,
  }) => {
    const token = await login('user', client)
    const clientId = (await doPurchase(client)).clientId
    console.log('ID DO CLIENTE PORRRAAAA', clientId)

    const response = await client
      .get(`/clients/${clientId}`)
      .header('Authorization', `Bearer ${token}`)

    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isObject(response.body().data)
    assert.isNotEmpty(response.body().data)
  })
})
