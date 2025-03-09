import { enableDisableGatewayValidator, setNewPriorityGatewayValidator } from '#validators/gateway'
import type { HttpContext } from '@adonisjs/core/http'
import GatewayRepository from '../repository/gatewayRepository.js'

const gatewayRepository = new GatewayRepository()
export default class GatewaysController {
  public async enableOrDisable({ request }: HttpContext) {
    const payload = await request.validateUsing(enableDisableGatewayValidator)
    const gateway = await gatewayRepository.toggle(payload.params.gatewayId)
    return {
      data: gateway,
    }
  }

  public async alterPriority({ request }: HttpContext) {
    const payload = await request.validateUsing(setNewPriorityGatewayValidator)
    const { newPriority } = payload
    const gatewayToBeChanged = await gatewayRepository.updatePriority(
      payload.params.gatewayId,
      newPriority
    )
    return { data: gatewayToBeChanged }
  }
}
