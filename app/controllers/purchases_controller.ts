import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { ChosenProducts, paymentDataType } from '../../customTypes/types.js'
import {
  makePurchaseValidator,
  findPurchaseDetailsValidator,
  refundPurchaseValidator,
} from '#validators/purchase'
import PurchaseRepository from '../repository/purchaseRepository.js'
import TransactionRepository from '../repository/transactionRepository.js'

const purchaseRepository = new PurchaseRepository()

export default class PurchasesController {
  public async purchase({ request }: HttpContext) {
    try {
      const payload = await request.validateUsing(makePurchaseValidator)

      const amount = await this.calculateTotalPrice(payload.products)

      const data: paymentDataType = {
        amount,
        name: payload.name,
        email: payload.email,
        cardNumber: payload.cardNumber,
        cvv: payload.cvv,
      }

      const transaction = await purchaseRepository.doPurchase(data, payload.products)

      return {
        data: transaction,
      }
    } catch (err) {
      throw err
    }
  }

  async calculateTotalPrice(products: ChosenProducts[]) {
    try {
      const productIds = products.map((product: any) => product.id)

      const productsInfo = await Product.query()
        .select('amount', 'product_id')
        .where('product_id', 'in', productIds)

      const amount = productsInfo.reduce((acc, product) => {
        const productData = products.find((p: any) => p.id === product.product_id)
        if (!productData) throw new Error('something went very wrong!')
        return acc + product.amount * productData.quantity
      }, 0)

      return amount * 100
    } catch (err) {
      throw err
    }
  }
  public async findAllPurchases() {
    const purchases = await purchaseRepository.findAll()
    return {
      data: purchases,
    }
  }

  public async findPurchaseDetails({ request }: HttpContext) {
    const payload = await request.validateUsing(findPurchaseDetailsValidator)

    const transactionRepository = new TransactionRepository()

    const [transaction, purchaseProducts] = await Promise.all([
      await transactionRepository.findById(payload.params.transactionId),
      await purchaseRepository.findAllPurchasesWhereIn('transaction_id', [
        { transaction_id: payload.params.transactionId },
      ]),
    ])

    console.log(transaction)

    const purchaseDetails = {
      ...transaction,
      purchaseProducts,
    }

    return {
      data: purchaseDetails,
    }
  }

  public async refund({ request }: HttpContext) {
    try {
      const payload = await request.validateUsing(refundPurchaseValidator)

      const refundRes = await purchaseRepository.doRefund(payload.params.transactionId)
      return { data: refundRes }
    } catch (err) {
      throw err
    }
  }
}
