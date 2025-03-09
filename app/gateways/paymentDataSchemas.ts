class PaymentDataSchema {
  public schemaHandlers: any
  constructor(schemaHandlers = {}) {
    this.schemaHandlers = schemaHandlers
  }

  transformaData(gatewayName: string, data: any) {
    try {
      const transformedData = this.schemaHandlers[`${gatewayName}Schema`](data)
      return transformedData
    } catch (err) {
      throw err
    }
  }
}

const firstGatewaySchema = (data: any) => {
  return data
}

const secondGatewaySchema = (data: any) => {
  return {
    valor: data.amount,
    nome: data.name,
    email: data.email,
    numeroCartao: data.cardNumber,
    cvv: data.cvv,
  }
}

const schemas = new PaymentDataSchema({ firstGatewaySchema, secondGatewaySchema })

export default schemas
