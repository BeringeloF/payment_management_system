import type { Router } from '@adonisjs/core/http'
import { middleware } from '../kernel.js'
import UsersController from '#controllers/users_controller'

export default (router: Router) => {
  router
    .get('/users', [UsersController, 'index'])
    .as('users.list')
    .use(middleware.requirePermissionAtContext({ requiredPermission: 'read', context: 'users' }))
  router
    .get('/users/:userId', [UsersController, 'show'])
    .as('users.show')
    .use(middleware.requirePermissionAtContext({ requiredPermission: 'read', context: 'users' }))
  router
    .patch('/users/:userId', [UsersController, 'update'])
    .as('users.update')
    .use(middleware.requirePermissionAtContext({ requiredPermission: 'update', context: 'users' }))
  router
    .delete('/users/:userId', [UsersController, 'destroy'])
    .as('users.destroy')
    .use(middleware.requirePermissionAtContext({ requiredPermission: 'delete', context: 'users' }))
}
