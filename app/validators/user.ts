import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    // Fields in request body
    email: vine.string(),
    password: vine.string(),
    roleId: vine.number().optional(),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    // Fields in request body
    email: vine.string(),
    password: vine.string(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    // Fields in request body
    email: vine.string().optional().requiredIfMissing('password'),
    password: vine.string().optional().requiredIfMissing('email'),

    params: vine.object({
      userId: vine.number(),
    }),
  })
)

export const deleteUserValidator = vine.compile(
  vine.object({
    // Fields in request body

    params: vine.object({
      userId: vine.number(),
    }),
  })
)

export const getUserValidator = vine.compile(
  vine.object({
    // Fields in request body

    params: vine.object({
      userId: vine.number(),
    }),
  })
)
