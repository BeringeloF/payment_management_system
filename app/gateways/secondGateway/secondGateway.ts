import axios from 'axios'
import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'

export const secondGatewayLogin = () => {
  try {
    return {
      'Gateway-Auth-Token': env.get('SECOND_GATEWAY_AUTH_GENERAL_AUTH_TOKEN'),
      'Gateway-Auth-Secret': env.get('SECOND_GATEWAY_AUTH_GENERAL_AUTH_SECRET'),
    }
  } catch (err) {
    throw err
  }
}

export const secondGatewayRefund = async (url: string, authHeaders: any, id: string) => {
  try {
    const res = await axios(url, {
      method: 'POST',
      data: {
        id,
      },
      headers: {
        ...authHeaders,
      },
    })
    console.log('SECONDREFUND', res)
    return res.data
  } catch (err) {
    throw err
  }
}

export const secondGatewayValidateCreditCard = async (data: any) => {
  try {
    if (data.cvv === '300' || data.cvv === '200') {
      throw new Exception('invalid credit card data', {
        status: 400,
      })
    }
  } catch (err) {
    throw err
  }
}
