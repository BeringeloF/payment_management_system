import axios from 'axios'
import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'

export const firstGatewayLogin = async () => {
  try {
    const url = env.get('FIRST_GATEWAY_URL')
    const data = await axios(`${url}/login`, {
      method: 'POST',
      data: {
        email: env.get('FIRST_GATEWAY_AUTH_EMAIL'),
        token: env.get('FIRST_GATEWAY_AUTH_TOKEN'),
      },
    })
    console.log('AXIOS RESPONSE', data.data.token)
    return {
      Authorization: `Bearer ${data.data.token}`,
    }
  } catch (err) {
    throw err
  }
}

export const firstGatewayRefund = async (url: string, authHeaders: any, id: string) => {
  try {
    const formattedUrl = url.replace(':id', id)
    const res = await axios(formattedUrl, {
      method: 'POST',
      headers: {
        ...authHeaders,
      },
    })
    console.log('FIRSTREFUND', res)
    return res.data
  } catch (err) {
    throw err
  }
}

export const firstGatewayValidateCreditCard = async (data: any) => {
  try {
    if (data.cvv === '100' || data.cvv === '200') {
      throw new Exception('invalid credit card data', {
        status: 400,
      })
    }
  } catch (err) {
    throw err
  }
}
