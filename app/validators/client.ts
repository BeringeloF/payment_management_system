import vine from '@vinejs/vine'

export const getClientValidator = vine.compile(
  vine.object({
    // Fields in request body

    params: vine.object({
      clientId: vine.number(),
    }),
  })
)
