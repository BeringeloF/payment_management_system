import vine from '@vinejs/vine'

export const makePurchaseValidator = vine.compile(
  vine.object({
    // Fields in request body
    name: vine.string(),
    email: vine.string(),
    cardNumber: vine.string().minLength(16).maxLength(16),
    cvv: vine.string(),
    products: vine.array(
      vine.object({
        id: vine.number(),
        quantity: vine.number(),
      })
    ),
  })
)

export const findPurchaseDetailsValidator = vine.compile(
  vine.object({
    params: vine.object({
      transactionId: vine.number(),
    }),
  })
)

export const refundPurchaseValidator = vine.compile(
  vine.object({
    params: vine.object({
      transactionId: vine.number(),
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
