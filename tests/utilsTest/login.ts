export default async (role: string, client: any) => {
  const roles: any = {
    user: 'normal@user.com',
    manager: 'manager@user.com',
    finance: 'finance@user.com',
    admin: 'admin@user.com',
  }

  const token = (
    await client.post('/login').json({
      email: roles[role],
      password: 'test1234',
    })
  ).body().accessToken.token

  return token
}
