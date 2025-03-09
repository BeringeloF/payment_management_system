import type { Router } from '@adonisjs/core/http'
import { middleware } from '../kernel.js'
import PurchasesController from '#controllers/purchases_controller'

export default (router: Router) => {
  router.get('/purchases', [PurchasesController, 'findAllPurchases']).as('purchases.all')

  router
    .get('/purchases/:transactionId', [PurchasesController, 'findPurchaseDetails'])
    .as('purchase.details')

  router
    .post('/purchases/refund/:transactionId', [PurchasesController, 'refund'])
    .as('purchase.refund')
    .use(
      middleware.requirePermissionAtContext({
        requiredPermission: 'refund',
        context: 'transactions',
      })
    )
}
