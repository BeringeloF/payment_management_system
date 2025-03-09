import db from '@adonisjs/lucid/services/db'

export const getUserPermissions = async (userId: number) => {
  const query = ` SELECT p.action, p.context FROM permissions p
     JOIN roles_permissions rp ON rp.permission_id = p.permission_id
     JOIN users u ON u.role_id = rp.role_id
     WHERE u.user_id = ?`

  const permissions = await db.rawQuery(query, [userId])

  return permissions[0]
}

export const getUserRole = async (userIds: number[]) => {
  const query = `SELECT name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.user_id IN (?, ?)`

  const roles = await db.rawQuery(query, userIds)

  return roles[0]
}

export const upperSnakeCase = (str: string) => {
  let formattedString = ''
  str.split('').forEach((c: string) => {
    if (c.toUpperCase() !== c) formattedString += c.toUpperCase()
    else formattedString += '_' + c
  })
  return formattedString
}
