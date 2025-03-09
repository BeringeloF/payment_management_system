import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Exception } from '@adonisjs/core/exceptions'
import { getUserPermissions } from '../utils.js'

type Permissions = {
  action: string
  context: string
}

export default class RequirePermissionAtContextMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    permissionsAndContext: { requiredPermission: string; context: string }
  ) {
    if (!ctx.auth.user)
      throw new Exception('Permission denied', {
        status: 403,
      })

    const permissions = await getUserPermissions(ctx.auth.user.user_id)

    const hasPermission = permissions.find(
      (p: Permissions) =>
        (p.action === permissionsAndContext.requiredPermission &&
          p.context === permissionsAndContext.context) ||
        p.action === 'all'
    )

    if (!hasPermission)
      throw new Exception('Permission denied', {
        status: 403,
      })
    await next()
  }
}
