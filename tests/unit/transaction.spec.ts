import { test } from '@japa/runner'
import Transaction from '#models/transaction'

import sinon from 'sinon'

import db from '@adonisjs/lucid/services/db'
import TransactionRepository from '../../app/repository/transactionRepository.js'

test.group('TransactionRepository Unit Tests', (group) => {
  group.each.teardown(async () => {
    sinon.restore()
  })
  test('save method should work', async ({ assert }) => {
    const repository = new TransactionRepository()
    const fakeTransaction = {
      amount: 1000,
      client_id: 1,
      gateway_id: 1,
      external_id: 'id',
      card_last_numbers: 2937,
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

    const transaction = {
      transaction_id: 120,
      related() {
        return this
      },
      attach() {},
    }
    sinon.stub(Transaction, 'create').resolves(transaction as any)
    const result = await repository.save(
      fakeTransaction,
      products,
      'not a real db transaction' as any
    )

    assert.equal(result.transaction_id, transaction.transaction_id)
  })

  test('findAll method should work', async ({ assert }) => {
    const repository = new TransactionRepository()

    const queryObj = {
      joinRaw() {
        return this
      },
      select() {
        return this
      },
      where() {
        return 'allTransactions'
      },
    }

    sinon.stub(db, 'from').returns(queryObj as any)

    const result = await repository.findAll({})

    assert.equal(result, 'allTransactions')
  })

  test('findById method should work', async ({ assert }) => {
    const repository = new TransactionRepository()

    sinon.stub(Transaction, 'findByOrFail').returns('specific transaction' as any)

    const result = await repository.findById(1)

    assert.equal(result, 'specific transaction')
  })
})
