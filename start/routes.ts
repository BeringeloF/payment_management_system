/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import userRoutes from './routes/userRoutes.js'
import PurchasesController from '#controllers/purchases_controller'

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

import productRoutes from './routes/productRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
import purchaseRoutes from './routes/purchaseRoutes.js'
import gatewayRoutes from './routes/gatewayRoutes.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

//public routes
router.post('/register', [AuthController, 'register']).as('register')
router.post('/login', [AuthController, 'login']).as('login')
router.post('/purchases/buy', [PurchasesController, 'purchase']).as('purchase.buy')

//protected routes
router
  .group(() => {
    //user
    userRoutes(router)
    //products
    productRoutes(router)

    //clients
    clientRoutes(router)

    //purchases
    purchaseRoutes(router)

    //gateways
    gatewayRoutes(router)
  })
  .use(middleware.auth())
