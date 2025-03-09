export type paymentDataType = {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export type ClientData = {
  name: string
  email: string
}

export type ChosenProducts = {
  id: number
  quantity: number
}

export type ProductDetails = {
  product_id: number
  name: string
}

export type TransactionData = {
  external_id: string
  client_id: number
  gateway_id: number
  amount: number
  card_last_numbers: number
}

export type Purchases = ProductDetails & {
  transaction_id: number
  quantity: number
}

export type TransactionDetails = TransactionData & {
  transaction_id: number
  products?: Purchases[]
}
