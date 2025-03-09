import { middleware } from '../kernel.js'
import type { Router } from '@adonisjs/core/http'
import ProductsController from '#controllers/products_controller'

export default (router: Router) => {
  router
    .get('/products', [ProductsController, 'index'])
    .as('products.list')
    .use(middleware.requirePermissionAtContext({ requiredPermission: 'read', context: 'products' }))
  router
    .get('/products/:productId', [ProductsController, 'show'])
    .as('products.show')
    .use(middleware.requirePermissionAtContext({ requiredPermission: 'read', context: 'products' }))
  router
    .post('/products', [ProductsController, 'store'])
    .as('products.store')
    .use(
      middleware.requirePermissionAtContext({ requiredPermission: 'create', context: 'products' })
    )
  router
    .patch('/products/:productId', [ProductsController, 'update'])
    .as('products.update')
    .use(
      middleware.requirePermissionAtContext({ requiredPermission: 'update', context: 'products' })
    )
  router
    .delete('/products/:productId', [ProductsController, 'destroy'])
    .as('products.destroy')
    .use(
      middleware.requirePermissionAtContext({ requiredPermission: 'delete', context: 'products' })
    )
}
