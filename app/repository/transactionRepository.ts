import db from '@adonisjs/lucid/services/db'
import Transaction from '#models/transaction'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { ChosenProducts, TransactionData, TransactionDetails } from '../../customTypes/types.js'

type productDataType = {
  [key: string]: {
    quantity: number
  }
}

class TransactionRepository {
  public db
  constructor() {
    this.db = db
  }

  async save(data: TransactionData, products: ChosenProducts[], trx: TransactionClientContract) {
    try {
      const transaction = await Transaction.create(data, { client: trx })

      const productsData: productDataType = {}

      products.forEach((product) => {
        productsData[product.id] = {
          quantity: product.quantity,
        }
      })

      console.log(productsData)

      const transaction_products = await transaction.related('products').attach(productsData)

      console.log(transaction_products)

      return transaction
    } catch (err) {
      throw err
    }
  }

  async findAll(queryFilter: any) {
    try {
      const transactions: TransactionDetails[] = await db
        .from('transactions')
        .select('*')
        .where({
          ...queryFilter,
        })

      return transactions
    } catch (err) {
      throw err
    }
  }

  async findById(transactionId: number) {
    try {
      const transaction: Transaction = await Transaction.findOrFail(transactionId)

      return transaction
    } catch (err) {
      throw err
    }
  }
}

export default TransactionRepository
