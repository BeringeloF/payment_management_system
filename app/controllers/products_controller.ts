import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getSpecificProductValidator,
} from '#validators/product'
import ProductRepository from '../repository/productRepository.js'

const productRepository = new ProductRepository()

export default class ProductsController {
  public async index({ response }: HttpContext) {
    try {
      const products: Product[] = await productRepository.findAll()
      return response.status(200).json({ results: products.length, data: products })
    } catch (err) {
      throw err
    }
  }

  public async show({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(getSpecificProductValidator)
      const product = await productRepository.findById(payload.params.productId)

      return response.status(200).json({ data: product })
    } catch (err) {
      throw err
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createProductValidator)
      const data = {
        name: payload.name,
        amount: payload.amount,
      }
      const product = await productRepository.create(data)
      return response.status(201).json({ data: product })
    } catch (err) {
      throw err
    }
  }

  public async update({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateProductValidator)
      const product = await productRepository.update(payload.params.productId, payload)

      return response.status(200).json({ data: product })
    } catch (err) {
      throw err
    }
  }

  public async destroy({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(deleteProductValidator)
      await productRepository.delete(payload.params.productId)

      return response.status(204).json({ data: null })
    } catch (err) {
      throw err
    }
  }
}
