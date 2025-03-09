import { test } from '@japa/runner'
import ClientsController from '#controllers/clients_controller'
import sinon from 'sinon'
import type { HttpContext } from '@adonisjs/core/http'
import ClientRepository from '../../app/repository/clientRepository.js'
import Client from '#models/client'
import TransactionRepository from '../../app/repository/transactionRepository.js'
import PurchaseRepository from '../../app/repository/purchaseRepository.js'

test.group('ClientController Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })
  test('should get all clients', async ({ assert }) => {
    const controller = new ClientsController()

    const fakeClient = {
      client_id: 1,
      name: 'jonas',
      email: 'jonas@email.com',
    }

    const request = {
      validateUsing() {
        return {
          params: {
            clientId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(ClientRepository.prototype, 'findAll').resolves([fakeClient] as any)

    const result = await controller.index({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { results: 1, data: [fakeClient] })
    assert.isTrue(response.status.calledWith(200))
    assert.isTrue(response.json.calledOnce)
  })

  test('should get a specific client', async ({ assert }) => {
    const controller = new ClientsController()

    const fakeClient = {
      client_id: 1,
      name: 'jonas',
      email: 'jonas@email.com',
    }

    const request = {
      validateUsing() {
        return {
          params: {
            clientId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(ClientRepository.prototype, 'findClientDetails').resolves(fakeClient as any)

    const result = await controller.show({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: fakeClient })
    assert.isTrue(response.status.calledWith(200))
    assert.isTrue(response.json.calledOnce)
  })
})

test.group('ClientRepository Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })
  test('should get clients details', async ({ assert }) => {
    const fakeClient = {
      client_id: 1,
      name: 'jonas',
      email: 'jonas@email.com',
    }
    const repository = new ClientRepository()

    sinon.stub(Client, 'findOrFail').resolves(fakeClient as any)
    sinon.stub(TransactionRepository.prototype, 'findAll').resolves([] as any)
    sinon
      .stub(PurchaseRepository.prototype, 'findAllPurchasesWhereIn')
      .resolves([1, 3, 4, 5] as any)

    const result = await repository.findClientDetails(1)

    assert.equal(result.allPurchases.length, 4)
  })

  test('should save a client', async ({ assert }) => {
    const fakeClient = {
      client_id: 1,
      name: 'jonas',
      email: 'jonas@email.com',
    }
    const repository = new ClientRepository()

    const select = {
      select() {
        return {
          where() {
            return false
          },
        }
      },
    }

    sinon.stub(Client, 'query').returns(select as any)
    sinon.stub(Client, 'create').resolves(fakeClient as any)

    const result = await repository.save(fakeClient, 'fake transaction' as any)

    assert.deepEqual(result, fakeClient)
  })
})
