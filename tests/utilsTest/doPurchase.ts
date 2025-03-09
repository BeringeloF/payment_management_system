export default async (client: any) => {
  try {
    const jsonData = {
      products: [
        {
          id: 2,
          quantity: 2,
        },
      ],
      name: 'tester',
      email: 'tester@email.com',
      cardNumber: '5569000000006063',
      cvv: '010',
    }
    const response = await client.post('/purchases/buy').json(jsonData)
    console.log(response.body())
    return response.body().data
  } catch (err) {
    throw err
  }
}
