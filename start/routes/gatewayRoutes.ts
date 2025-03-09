import type { Router } from '@adonisjs/core/http'
import GatewaysController from '#controllers/gateways_controller'

export default (router: Router) => {
  router
    .post('/gateways/enable-disable/:gatewayId', [GatewaysController, 'enableOrDisable'])
    .as('gateway.toggleEnableDisable')

  router
    .patch('/gateways/priority/:gatewayId', [GatewaysController, 'alterPriority'])
    .as('gateway.priority')
}
