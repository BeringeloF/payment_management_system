import Client from '#models/client'

import { inspect } from 'util'
import { Purchases, TransactionDetails, ClientData } from '../../customTypes/types.js'
import PurchaseRepository from './purchaseRepository.js'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import db from '@adonisjs/lucid/services/db'
import { Database } from '@adonisjs/lucid/database'
import TransactionRepository from './transactionRepository.js'

class ClientRepository {
  db: Database
  constructor() {
    this.db = db
  }
  async findAll() {
    try {
      const clients = await Client.all()
      return clients
    } catch (err) {
      throw err
    }
  }
  async findClientDetails(clientId: number) {
    try {
      const client = await Client.findOrFail(clientId)

      const transactionRepository = new TransactionRepository()
      const purchaseRepository = new PurchaseRepository()

      const transactions: TransactionDetails[] = await transactionRepository.findAll({
        client_id: clientId,
      })

      const allPurchases: Purchases[] = await purchaseRepository.findAllPurchasesWhereIn(
        'transaction_id',
        transactions
      )

      console.log(inspect(transactions, true, 4))

      const clientDetails = {
        client,
        allPurchases,
      }
      return clientDetails
    } catch (err) {
      throw err
    }
  }

  async save(data: ClientData, trx: TransactionClientContract) {
    try {
      const clientExists = await Client.query().select('client_id').where({
        email: data.email,
      })

      console.log('clsdjflskjdflksajdf', clientExists)

      if (clientExists.length > 0) {
        return clientExists[0]
      }
      const client = await Client.create(data, { client: trx })

      return client
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

export default ClientRepository
