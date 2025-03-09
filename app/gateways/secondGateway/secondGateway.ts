import axios from 'axios'
import { Exception } from '@adonisjs/core/exceptions'

export const secondGatewayLogin = () => {
  try {
    return {
      'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
      'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
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
