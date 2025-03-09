import Gateway from '#models/gateway'
import paymentGate from './gateways.js'
import env from '#start/env'
import { paymentDataType } from '../../customTypes/types.js'

export class Payment {
  private data: paymentDataType | undefined
  private id: string | undefined
  private retries: string | undefined = env.get('PAYMENT_RETRIES')
  constructor(data: paymentDataType | string) {
    if (typeof data === 'string') this.id = data
    else this.data = data
  }

  public async pay() {
    try {
      if (!this.data) throw new Error('data should not be undefined')
      const gateways = await this.getGateways()

      let counter = 0

      for (const gateway of gateways) {
        const [err, paymentRes] = await this.tryToPayOn(gateway, this.data)
        if (paymentRes) return paymentRes
        console.log('ERROR ON .PAY()', err)

        counter += 1

        if ((this.retries && counter === Number(this.retries)) || gateways.length === counter)
          throw err
      }
    } catch (error) {
      throw error
    }
  }

  private async tryToPayOn(gateway: Gateway, data: paymentDataType) {
    try {
      const authHeaders = await paymentGate.getAuthHeaders(gateway.name)

      const transformaData = paymentGate.transformData(gateway.name, data)

      console.log('data transformed', transformaData)

      await paymentGate.validateCreditCardData(data, gateway.name)

      const paymentSuccess = await paymentGate.performPayment(
        transformaData,
        authHeaders,
        gateway.name
      )

      const paymentSuccessData = {
        id: paymentSuccess.data.id,
        gateway_id: gateway.gateway_id,
      }
      return [null, paymentSuccessData]
    } catch (err) {
      return [err, null]
    }
  }

  private async getGateways() {
    const gateways = await Gateway.query()
      .from('gateways')
      .select('*')
      .where({
        is_active: true,
      })
      .orderBy('priority', 'asc')
    return gateways
  }

  public async refund() {
    try {
      if (!this.id) throw new Error('id should not be undefined')
      const gateways = await this.getGateways()

      let counter = 0

      for (const gateway of gateways) {
        const [err, refundRes] = await this.tryToRefundOn(gateway, this.id)
        if (refundRes) return refundRes
        console.log('ERROR ON .REFUND()', err)

        counter += 1

        if ((this.retries && counter === Number(this.retries)) || gateways.length === counter)
          throw err
      }
    } catch (error) {
      throw error
    }
  }

  private async tryToRefundOn(gateway: Gateway, id: string) {
    try {
      const authHeaders = await paymentGate.getAuthHeaders(gateway.name)
      const refundRes = await paymentGate.performRefund(gateway.name, authHeaders, id)
      console.log(refundRes)
      return [null, refundRes]
    } catch (err) {
      return [err, null]
    }
  }
}
