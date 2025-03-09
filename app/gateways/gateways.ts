import env from '#start/env'
import axios from 'axios'
import schemas from './paymentDataSchemas.js'
import * as firstGateway from './firstGateway/firstGateway.js'
import * as secondGateway from './secondGateway/secondGateway.js'
import { upperSnakeCase } from '../utils.js'

class PaymentGateways {
  public gatewayHandlers: any
  constructor(gatewaysHandlers = {}) {
    this.gatewayHandlers = gatewaysHandlers
  }

  async getAuthHeaders(gatewayName: string) {
    try {
      const data = await this.gatewayHandlers[`${gatewayName}Login`]()
      return data
    } catch (err) {
      throw err
    }
  }

  transformData(gatewayName: string, data: any) {
    return schemas.transformaData(gatewayName, data)
  }

  async performPayment(data: any, authHeaders: any, gatewayName: string) {
    try {
      const url = env.get(`${upperSnakeCase(gatewayName)}_PAYMENT_ROUTE`)
      if (!url) throw new Error('gateway url is undefined')

      const resData = await axios(url, {
        method: 'POST',
        data,
        headers: {
          ...authHeaders,
        },
      })
      return resData
    } catch (err) {
      throw err
    }
  }

  async validateCreditCardData(data: any, gatewayName: string) {
    try {
      await this.gatewayHandlers[`${gatewayName}ValidateCreditCard`](data)
    } catch (err) {
      throw err
    }
  }

  async performRefund(gatewayName: string, authHeaders: any, id: string) {
    try {
      const url = env.get(`${upperSnakeCase(gatewayName)}_REFUND_ROUTE`)
      const res = await this.gatewayHandlers[`${gatewayName}Refund`](url, authHeaders, id)
      return res
    } catch (err) {
      throw err
    }
  }
}

const paymentGate = new PaymentGateways({
  ...firstGateway,
  ...secondGateway,
})

export default paymentGate
