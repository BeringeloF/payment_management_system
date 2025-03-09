import { test } from '@japa/runner'
import login from '#tests/utilsTest/login'
import db from '@adonisjs/lucid/services/db'

test.group('Gateway Integration Test', () => {
  test('POST /gateways/enable-disable/:gatewayId', async ({ assert, client }) => {
    const token = await login('user', client)

    const response = await client
      .post('/gateways/enable-disable/1')
      .header('Authorization', `Bearer ${token}`)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isNotEmpty(response.body().data)
    assert.equal(response.body().data.isActive, false)
  })

  test('POST /gateways/enable-disable/:gatewayId', async ({ assert, client }) => {
    const token = await login('user', client)
    const jsonData = {
      newPriority: 1,
    }
    const response = await client
      .patch('/gateways/priority/2')
      .header('Authorization', `Bearer ${token}`)
      .json(jsonData)
    response.dumpBody()
    response.dumpError()
    response.assertStatus(200)

    assert.isNotEmpty(response.body().data)
    assert.equal(response.body().data.priority, 1)
  })

  test('pegando todos os gateways', async () => {
    const gateways = await db.from('gateways').select('*')
    console.log(gateways)
  })
})
