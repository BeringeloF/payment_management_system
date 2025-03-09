import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'

class ProductRepository {
  public db
  constructor() {
    this.db = db
  }

  async create(data: any) {
    try {
      const product = await Product.create(data)

      return product
    } catch (err) {
      throw err
    }
  }

  async findAll() {
    try {
      const products: Product[] = await Product.all()
      return products
    } catch (err) {
      throw err
    }
  }

  async findById(productId: number) {
    try {
      const product = await Product.findOrFail(productId)
      return product
    } catch (err) {
      throw err
    }
  }
  async update(productId: number, data: any) {
    try {
      const product = await Product.findOrFail(productId)

      product.name = data.name || product.name
      product.amount = data.amount || product.amount

      await product.save()
      return product
    } catch (err) {
      throw err
    }
  }

  async delete(productId: number) {
    try {
      const product = await Product.findOrFail(productId)

      await product.delete()
    } catch (err) {
      throw err
    }
  }
}

export default ProductRepository
