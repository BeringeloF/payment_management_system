import type { Router } from '@adonisjs/core/http'
import ClientsController from '#controllers/clients_controller'

export default (router: Router) => {
  router.get('/clients', [ClientsController, 'index']).as('clients.all')
  router.get('/clients/:clientId', [ClientsController, 'show']).as('clients.show')
}
