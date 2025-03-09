import { test } from '@japa/runner'
import * as utils from '../../app/utils.js'
import sinon from 'sinon'
import db from '@adonisjs/lucid/services/db'

test.group('Utils Functions Unit Test', (group) => {
  group.each.teardown(() => {
    sinon.restore()
  })
  test('getUserPermissions should work', async ({ assert }) => {
    sinon.stub(db, 'rawQuery').resolves(['permission'])
    const permissions = await utils.getUserPermissions(1)

    assert.equal(permissions, 'permission')
  })

  test('getUserRole should work', async ({ assert }) => {
    sinon.stub(db, 'rawQuery').resolves(['role'])
    const roles = await utils.getUserRole([])

    assert.equal(roles, 'role')
  })
})
