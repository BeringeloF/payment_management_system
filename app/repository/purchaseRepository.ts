import db from '@adonisjs/lucid/services/db'
import type { Database } from '@adonisjs/lucid/database'
import {
  ChosenProducts,
  paymentDataType,
  Purchases,
  TransactionDetails,
} from '../../customTypes/types.js'
import { Payment } from '../gateways/payment.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import ClientRepository from './clientRepository.js'
import TransactionRepository from './transactionRepository.js'
import { Exception } from '@adonisjs/core/exceptions'

type TransactionsWithOnlyId = {
  transaction_id: number
}

class PurchaseRepository {
  private db: Database
  constructor() {
    this.db = db
  }

  async doPurchase(data: paymentDataType, products: ChosenProducts[]) {
    let trx: TransactionClientContract | undefined
    try {
      const payment = new Payment(data)
      const paymentData = await payment.pay()

      console.log(paymentData, 'payment successfuly made')

      trx = await db.transaction()

      const clientRepository = new ClientRepository()

      const client = await clientRepository.save({ name: data.name, email: data.email }, trx)

      const transactionRepository = new TransactionRepository()

      const transaction = await transactionRepository.save(
        {
          external_id: paymentData.id,
          gateway_id: paymentData.gateway_id,
          client_id: client.client_id,
          amount: data.amount,
          card_last_numbers: Number(data.cardNumber.slice(-4)),
        },
        products,
        trx
      )

      console.log(transaction)

      await trx.commit()
      return transaction
    } catch (err) {
      await trx?.rollback()

      throw err
    }
  }

  async findAllPurchasesWhereIn(
    column: string,
    transactions: TransactionDetails[] | TransactionsWithOnlyId[]
  ) {
    try {
      const query = ` JOIN products p ON 
      p.product_id = transaction_products.product_id`

      const allPurchases: Purchases[] = await this.db
        .from('transaction_products')
        .joinRaw(query)
        .select('transaction_products.quantity', 'transaction_products.transaction_id')
        .select('p.name', 'p.product_id')
        .whereIn(
          column,
          transactions.map((t) => t.transaction_id)
        )

      return allPurchases
    } catch (err) {
      throw err
    }

    //this.formatPurchaseDetails(allPurchases, transactions)
  }

  async findAll(queryFilter?: any) {
    try {
      const query = ` JOIN products p ON 
      p.product_id = transaction_products.product_id`

      const allPurchases: Purchases[] = await this.db
        .from('transaction_products')
        .joinRaw(query)
        .select('transaction_products.quantity', 'transaction_products.transaction_id')
        .select('p.name', 'p.product_id')
        .where({
          ...queryFilter,
        })

      return allPurchases
    } catch (err) {
      throw err
    }
  }

  async doRefund(transactionId: number) {
    try {
      const transactionRepository = new TransactionRepository()

      const transaction = await transactionRepository.findById(transactionId)

      if (transaction.status === 'refunded')
        throw new Exception('this transaction was alredy refunded!', {
          status: 409,
        })

      const payment = new Payment(transaction.external_id)
      const refundRes = await payment.refund()
      console.log('refundresspdofjaskdlfjaskldfjlsd', refundRes)
      transaction.status = 'refunded'
      console.log('a transaction', transaction)
      await transaction.save()
      return refundRes
    } catch (err) {
      throw err
    }
  }

  // private formatPurchaseDetails(allPurchases: Purchases[], transactions: TransactionDetails[]) {
  //   try {
  //     const transactionArr = [...transactions]
  //     allPurchases.forEach((p) => {
  //       const index = transactionArr.findIndex((t) => t.transaction_id === p.transaction_id)

  //       if (index === -1) return
  //       if (transactionArr[index]?.products) {
  //         transactionArr[index].products.push(p)
  //       } else {
  //         transactionArr[index].products = []
  //         transactionArr[index].products.push(p)
  //       }
  //     })
  //     return transactionArr
  //   } catch (err) {
  //     throw err
  //   }
  // }
}

export default PurchaseRepository
