import User from '#models/user'

type queryFilter = {
  [chave: string]: unknown
}

interface PermissionsHandler {
  [key: string]: (user: User) => queryFilter
}

class FormatQuery {
  permissionsHandler: PermissionsHandler = {}
  constructor(permissionsHandler: PermissionsHandler = {}) {
    this.permissionsHandler = permissionsHandler
  }
  applyPermissionFilter(permission: string, user: User): queryFilter {
    return this.permissionsHandler[permission](user)
  }
}

const readAll = (): queryFilter => {
  return {}
}

const queryFormatter = new FormatQuery({
  readAll,
})

export default queryFormatter
