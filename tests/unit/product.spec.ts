import { test } from '@japa/runner'
import ProductsController from '#controllers/products_controller'
import ProductRepository from '../../app/repository/productRepository.js'
import sinon from 'sinon'
import type { HttpContext } from '@adonisjs/core/http'

import Product from '#models/product'

test.group('ProductController Unit Tests', (group) => {
  // Controller Tests
  group.each.teardown(async () => {
    sinon.restore()
  })

  test('should create a product', async ({ assert }) => {
    const controller = new ProductsController()
    const fakeProduct = {
      name: 'Test Product',
      amount: 100,
    }
    const request = {
      validateUsing() {
        return fakeProduct
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(ProductRepository.prototype, 'create').resolves(fakeProduct as any)

    const result = await controller.store({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: fakeProduct })
    assert.isTrue(response.status.calledWith(201))
    assert.isTrue(response.json.calledOnce)
  })

  test('should update a product', async ({ assert }) => {
    const controller = new ProductsController()
    const fakeProduct = {
      name: 'Test Product',
      amount: 100,
    }
    const request = {
      validateUsing() {
        return {
          name: fakeProduct.name,
          amount: fakeProduct.amount,
          params: {
            productId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(ProductRepository.prototype, 'update').resolves(fakeProduct as any)

    const result = await controller.update({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: fakeProduct })
    assert.isTrue(response.status.calledWith(200))
    assert.isTrue(response.json.calledOnce)
  })

  test('should get all products', async ({ assert }) => {
    const controller = new ProductsController()
    const fakeProduct = {
      name: 'Test Product',
      amount: 100,
    }
    const request = {
      validateUsing() {
        return {
          ...fakeProduct,
          params: {
            productId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(ProductRepository.prototype, 'findAll').resolves([fakeProduct] as any)

    const result = await controller.index({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { results: 1, data: [fakeProduct] })
    assert.isTrue(response.status.calledWith(200))
    assert.isTrue(response.json.calledOnce)
  })

  test('should get specific product', async ({ assert }) => {
    const controller = new ProductsController()
    const fakeProduct = {
      name: 'Test Product',
      amount: 100,
    }
    const request = {
      validateUsing() {
        return {
          ...fakeProduct,
          params: {
            productId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(ProductRepository.prototype, 'findById').resolves(fakeProduct as any)

    const result = await controller.show({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: fakeProduct })
    assert.isTrue(response.status.calledWith(200))
    assert.isTrue(response.json.calledOnce)
  })

  test('should delete a products', async ({ assert }) => {
    const controller = new ProductsController()
    const fakeProduct = {
      name: 'Test Product',
      amount: 100,
    }
    const request = {
      validateUsing() {
        return {
          ...fakeProduct,
          params: {
            productId: 1,
          },
        }
      },
    }
    const response = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy((res) => res),
    }

    sinon.stub(ProductRepository.prototype, 'delete').resolves(null as any)

    const result = await controller.destroy({ request, response } as unknown as HttpContext)

    assert.deepEqual(result, { data: null })
    assert.isTrue(response.status.calledWith(204))
    assert.isTrue(response.json.calledOnce)
  })
})

test.group('ProductRepository Unit Tests', () => {
  test('should update a product R', async ({ assert }) => {
    const repository = new ProductRepository()
    const fakeProduct = {
      name: 'Test Product',
      amount: 100,
      save() {},
    }

    const updatedProduct = {
      name: 'Test Product',
      amount: 200,
      save() {},
    }

    sinon.stub(Product, 'findOrFail').resolves(fakeProduct as any)

    const result = await repository.update(1, updatedProduct)
    console.log(result.amount, updatedProduct.amount)

    assert.equal(result.amount, updatedProduct.amount)
  })
})
