import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    // Fields in request body
    name: vine.string(),
    amount: vine.number(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    // Fields in request body
    name: vine.string().optional().requiredIfMissing('amount'),
    amount: vine.number().optional().requiredIfMissing('name'),

    params: vine.object({
      productId: vine.number(),
    }),
  })
)

export const getSpecificProductValidator = vine.compile(
  vine.object({
    // Fields in request body

    params: vine.object({
      productId: vine.number(),
    }),
  })
)

export const deleteProductValidator = vine.compile(
  vine.object({
    // Fields in request body

    params: vine.object({
      productId: vine.number(),
    }),
  })
)
