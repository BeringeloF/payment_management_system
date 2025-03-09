import type { HttpContext } from '@adonisjs/core/http'
import { getClientValidator } from '#validators/client'
import ClientRepository from '../repository/clientRepository.js'

const clientRepository = new ClientRepository()

export default class ClientsController {
  public async index({ response }: HttpContext) {
    const clients = await clientRepository.findAll()

    return response.status(200).json({
      results: clients.length,
      data: clients,
    })
  }

  public async show({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getClientValidator)
    const client = await clientRepository.findClientDetails(payload.params.clientId)
    return response.status(200).json({
      data: client,
    })
  }
}
