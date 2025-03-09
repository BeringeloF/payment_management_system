import { test } from '@japa/runner'
import GatewayRepository from '../../app/repository/gatewayRepository.js'
import GatewaysController from '#controllers/gateways_controller'
import Gateway from '#models/gateway'
import sinon from 'sinon'
import type { HttpContext } from '@adonisjs/core/http'

test.group('GatewayController Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })
  test('should disable gateway', async ({ assert }) => {
    const controller = new GatewaysController()

    const fakeGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 1,
      is_active: true,
    }

    const request = {
      validateUsing() {
        return {
          params: {
            gatewayId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(GatewayRepository.prototype, 'toggle').resolves(fakeGateway as any)

    const result = await controller.enableOrDisable({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: fakeGateway })
    //assert.isTrue(response.status.calledWith(200))
    //assert.isTrue(response.json.calledOnce)
  })

  test('should alter the gateway priority', async ({ assert }) => {
    const controller = new GatewaysController()

    const fakeGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 2,
      is_active: true,
    }

    const request = {
      validateUsing() {
        return {
          newPriority: 2,
          params: {
            gatewayId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(GatewayRepository.prototype, 'updatePriority').resolves(fakeGateway as any)

    const result = await controller.alterPriority({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: fakeGateway })
    //assert.isTrue(response.status.calledWith(200))
    //assert.isTrue(response.json.calledOnce)
  })
})

test.group('GatewayRepository Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })

  test('should alter the gateway priority when the new priority is lower than the previous one', async ({
    assert,
  }) => {
    const repository = new GatewayRepository()

    const fakeGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 1,
      is_active: true,
      save() {},
    }

    const expectedGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 4,
      is_active: true,
      save() {},
    }

    const fakeGateways = [
      {
        gateway_id: 23,
        name: 'dkfGateway',
        priority: 2,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2353,
        name: 'dkfGatdfeway',
        priority: 3,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2653,
        name: 'dkfgfdsGateway',
        priority: 4,
        is_active: true,
        save() {},
      },
    ]

    const changedFakeGateways = [
      {
        gateway_id: 23,
        name: 'dkfGateway',
        priority: 2,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2353,
        name: 'dkfGatdfeway',
        priority: 3,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2653,
        name: 'dkfgfdsGateway',
        priority: 4,
        is_active: true,
        save() {},
      },
    ]

    const queryObj = {
      where() {
        return {
          where() {
            return changedFakeGateways
          },
        }
      },
    }

    sinon.stub(Gateway, 'findOrFail').resolves(fakeGateway as any)
    sinon.stub(Gateway, 'query').returns(queryObj as any)

    const result = await repository.updatePriority(1, 4)

    assert.equal(result.priority, expectedGateway.priority)
    assert.equal(changedFakeGateways[0].priority, fakeGateways[0].priority - 1)
    assert.equal(changedFakeGateways[1].priority, fakeGateways[1].priority - 1)
    assert.equal(changedFakeGateways[2].priority, fakeGateways[2].priority - 1)
  })

  test('should alter the gateway priority when the new priority is greater than the previous one', async ({
    assert,
  }) => {
    const repository = new GatewayRepository()

    const fakeGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 4,
      is_active: true,
      save() {},
    }

    const expectedGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 1,
      is_active: true,
      save() {},
    }

    const fakeGateways = [
      {
        gateway_id: 23,
        name: 'dkfGateway',
        priority: 2,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2353,
        name: 'dkfGatdfeway',
        priority: 3,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2653,
        name: 'dkfgfdsGateway',
        priority: 1,
        is_active: true,
        save() {},
      },
    ]

    const changedFakeGateways = [
      {
        gateway_id: 23,
        name: 'dkfGateway',
        priority: 2,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2353,
        name: 'dkfGatdfeway',
        priority: 3,
        is_active: true,
        save() {},
      },
      {
        gateway_id: 2653,
        name: 'dkfgfdsGateway',
        priority: 1,
        is_active: true,
        save() {},
      },
    ]

    const queryObj = {
      where() {
        return {
          where() {
            return changedFakeGateways
          },
        }
      },
    }

    sinon.stub(Gateway, 'findOrFail').resolves(fakeGateway as any)
    sinon.stub(Gateway, 'query').returns(queryObj as any)

    const result = await repository.updatePriority(fakeGateway.gateway_id, expectedGateway.priority)

    assert.equal(result.priority, expectedGateway.priority)
    assert.equal(changedFakeGateways[0].priority, fakeGateways[0].priority + 1)
    assert.equal(changedFakeGateways[1].priority, fakeGateways[1].priority + 1)
    assert.equal(changedFakeGateways[2].priority, fakeGateways[2].priority + 1)
  })

  test('should toggle gateway disable', async ({ assert }) => {
    const repository = new GatewayRepository()

    const fakeGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 2,
      is_active: true,
      save() {},
    }

    sinon.stub(Gateway, 'findOrFail').resolves(fakeGateway as any)

    const result = await repository.toggle(1)

    console.log(result)

    assert.equal(result.is_active, false)
  })

  test('should toggle gateway disable', async ({ assert }) => {
    const repository = new GatewayRepository()

    const fakeGateway = {
      gateway_id: 1,
      name: 'firstGateway',
      priority: 2,
      is_active: false,
      save() {},
    }

    sinon.stub(Gateway, 'findOrFail').resolves(fakeGateway as any)

    const result = await repository.toggle(1)

    console.log(result)

    assert.equal(result.is_active, true)
  })
})

//   test('should get a specific client', async ({ assert }) => {
//     const controller = new ClientsController()

//     const fakeClient = {
//       client_id: 1,
//       name: 'jonas',
//       email: 'jonas@email.com',
//     }

//     const request = {
//       validateUsing() {
//         return {
//           params: {
//             clientId: 1,
//           },
//         }
//       },
//     }
//     const response = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy((res) => res),
//     }

//     sinon.stub(ClientRepository.prototype, 'findClientDetails').resolves(fakeClient as any)

//     const result = await controller.show({ request, response } as unknown as HttpContext)

//     assert.deepEqual(result, { data: fakeClient })
//     assert.isTrue(response.status.calledWith(200))
//     assert.isTrue(response.json.calledOnce)
//   })
// })

// test.group('ClientRepository Unit Tests', (group) => {
//   group.each.teardown(async () => {
//     sinon.restore()
//   })
//   test('should get clients details', async ({ assert }) => {
//     const fakeClient = {
//       client_id: 1,
//       name: 'jonas',
//       email: 'jonas@email.com',
//     }
//     const repository = new ClientRepository()

//     sinon.stub(Client, 'findOrFail').resolves(fakeClient as any)
//     sinon.stub(TransactionRepository.prototype, 'findAll').resolves([] as any)
//     sinon
//       .stub(PurchaseRepository.prototype, 'findAllPurchasesWhereIn')
//       .resolves([1, 3, 4, 5] as any)

//     const result = await repository.findClientDetails(1)

//     assert.equal(result.allPurchases.length, 4)
//   })

//   test('should save a client', async ({ assert }) => {
//     const fakeClient = {
//       client_id: 1,
//       name: 'jonas',
//       email: 'jonas@email.com',
//     }
//     const repository = new ClientRepository()

//     const select = {
//       select() {
//         return {
//           where() {
//             return false
//           },
//         }
//       },
//     }

//     sinon.stub(Client, 'query').returns(select as any)
//     sinon.stub(Client, 'create').resolves(fakeClient as any)

//     const result = await repository.save(fakeClient, 'fake transaction' as any)

//     assert.deepEqual(result, fakeClient)
//   })
// })
