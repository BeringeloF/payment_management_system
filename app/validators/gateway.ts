import vine from '@vinejs/vine'

export const enableDisableGatewayValidator = vine.compile(
  vine.object({
    params: vine.object({
      gatewayId: vine.number(),
    }),
  })
)

export const setNewPriorityGatewayValidator = vine.compile(
  vine.object({
    // Fields in request body
    newPriority: vine.number(),

    params: vine.object({
      gatewayId: vine.number(),
    }),
  })
)
