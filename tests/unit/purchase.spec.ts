import { test } from '@japa/runner'
import PurchaseRepository from '../../app/repository/purchaseRepository.js'
import PurchasesController from '#controllers/purchases_controller'
import TransactionRepository from '../../app/repository/transactionRepository.js'
import sinon from 'sinon'
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { Payment } from '../../app/gateways/payment.js'
import db from '@adonisjs/lucid/services/db'
import ClientRepository from '../../app/repository/clientRepository.js'

test.group('PurchaseController Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })

  test('should make a purchase', async ({ assert }) => {
    const controller = new PurchasesController()
    const request = {
      validateUsing() {
        return {
          products: [
            {
              id: 1,
              quantity: 3,
            },
            {
              id: 5,
              quantity: 2,
            },
          ],
          name: 'jonas',
          email: 'jonas@email.com',
          cardNumber: '293749651973',
          cvv: '433',
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(PurchasesController.prototype, 'calculateTotalPrice').resolves(1000 as any)
    sinon.stub(PurchaseRepository.prototype, 'doPurchase').resolves('purchaseDone' as any)

    const result = await controller.purchase({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: 'purchaseDone' })
  })

  test('should calculate total products price', async ({ assert }) => {
    const controller = new PurchasesController()
    const products = [
      {
        id: 1,
        quantity: 3,
      },
      {
        id: 5,
        quantity: 2,
      },
    ]

    const productsWithAmount = [
      {
        product_id: 1,
        amount: 234,
      },
      {
        product_id: 5,
        amount: 68,
      },
    ]

    const queryObj = {
      select() {
        return {
          where() {
            return productsWithAmount
          },
        }
      },
    }

    sinon.stub(Product, 'query').returns(queryObj as any)

    const result = await controller.calculateTotalPrice(products)

    assert.equal(result, 838 * 100)
  })

  test('should find all purchases', async ({ assert }) => {
    const controller = new PurchasesController()

    sinon.stub(PurchaseRepository.prototype, 'findAll').returns('all purchases' as any)

    const result = await controller.findAllPurchases()
    assert.deepEqual(result, { data: 'all purchases' })
  })

  test('should find purchase details', async ({ assert }) => {
    const controller = new PurchasesController()
    const request = {
      validateUsing() {
        return {
          params: {
            transactionId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon
      .stub(PurchaseRepository.prototype, 'findAllPurchasesWhereIn')
      .resolves('purchased products' as any)
    sinon
      .stub(TransactionRepository.prototype, 'findById')
      .resolves({ transaction: 'transactions' } as any)

    const result = await controller.findPurchaseDetails({
      request,
      response,
    } as unknown as HttpContext)

    assert.deepEqual(result, {
      data: {
        purchaseProducts: 'purchased products',
        transaction: 'transactions',
      },
    })
  })

  test('should make the refund', async ({ assert }) => {
    const controller = new PurchasesController()
    const request = {
      validateUsing() {
        return {
          params: {
            transactionId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(Payment.prototype, 'refund').resolves('success refund' as any)
    sinon
      .stub(TransactionRepository.prototype, 'findById')
      .resolves({ external_id: 'id', save() {} } as any)

    const result = await controller.refund({
      request,
      response,
    } as unknown as HttpContext)

    assert.deepEqual(result, {
      data: 'success refund',
    })
  })
})

test.group('PurchaseRepository Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })
  test('doPurchase mehthod should work', async ({ assert }) => {
    const repository = new PurchaseRepository()

    const fakePaymentData = {
      amount: 1000,
      name: 'jonas',
      email: 'jonas@email.com',
      cardNumber: '293749651973',
      cvv: '433',
    }

    const products = [
      {
        id: 1,
        quantity: 3,
      },
      {
        id: 5,
        quantity: 2,
      },
    ]

    sinon.stub(Payment.prototype, 'pay').resolves('success refund' as any)
    sinon.stub(db, 'transaction').resolves({ commit() {}, rollback() {} } as any)
    sinon.stub(ClientRepository.prototype, 'save').resolves({ client_id: 1 } as any)
    sinon.stub(TransactionRepository.prototype, 'save').resolves('purchaseDone' as any)

    const result = await repository.doPurchase(fakePaymentData, products)

    assert.equal(result, 'purchaseDone')
  })

  test('findAllPurchasesWhereIn method should work', async ({ assert }) => {
    const repository = new PurchaseRepository()

    const transactions = [
      {
        transaction_id: 34,
      },
    ]

    const queryObj = {
      joinRaw() {
        return this
      },
      select() {
        return this
      },
      whereIn() {
        return 'allPurchases'
      },
    }

    sinon.stub(db, 'from').returns(queryObj as any)

    const result = await repository.findAllPurchasesWhereIn('transaction_id', transactions)

    assert.equal(result, 'allPurchases')
  })

  test('findAll method should work', async ({ assert }) => {
    const repository = new PurchaseRepository()

    const queryObj = {
      joinRaw() {
        return this
      },
      select() {
        return this
      },
      where() {
        return 'allPurchases'
      },
    }

    sinon.stub(db, 'from').returns(queryObj as any)

    const result = await repository.findAll({})

    assert.equal(result, 'allPurchases')
  })

  test('refund method should work', async ({ assert }) => {
    const repository = new PurchaseRepository()

    sinon
      .stub(TransactionRepository.prototype, 'findById')
      .resolves({ external_id: 'id', save() {} } as any)
    sinon.stub(Payment.prototype, 'refund').resolves('refunded')

    const result = await repository.doRefund(1)

    assert.equal(result, 'refunded')
  })
})
