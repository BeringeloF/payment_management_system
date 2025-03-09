import Gateway from '#models/gateway'
import db from '@adonisjs/lucid/services/db'
import { Exception } from '@adonisjs/core/exceptions'

class GatewayRepository {
  db
  constructor() {
    this.db = db
  }

  async toggle(gatewayId: number) {
    try {
      const gateway = await Gateway.findOrFail(gatewayId)

      gateway.is_active = !gateway.is_active
      await gateway.save()
      return gateway
    } catch (err) {
      throw err
    }
  }

  async updatePriority(gatewayId: number, newPriority: number) {
    try {
      const gatewayToBeChanged = await Gateway.findOrFail(gatewayId)

      if (gatewayToBeChanged.priority === newPriority) return gatewayToBeChanged

      let isGreaterPriority = gatewayToBeChanged.priority > newPriority

      const firstCondition = isGreaterPriority ? '>=' : '<='
      const secondCondition = isGreaterPriority ? '<' : '>'

      const gateways = await Gateway.query()
        .where('priority', firstCondition, newPriority)
        .where('priority', secondCondition, gatewayToBeChanged.priority)

      if (gateways.length === 0)
        throw new Exception(
          'Invalid priority, make sure that the priority is between 1 and the number of gateways',
          { status: 400 }
        )

      gateways.forEach(async (gateway) => {
        if (isGreaterPriority) {
          gateway.priority += 1
        } else {
          gateway.priority -= 1
        }
        await gateway.save()
      })
      gatewayToBeChanged.priority = newPriority
      await gatewayToBeChanged.save()
      return gatewayToBeChanged
    } catch (err) {
      throw err
    }
  }
}

export default GatewayRepository
