import { Product } from "./Product"

export interface Root {
  cart: Cart
}

export interface Cart {
  email: string
  items: Item[]
  applied_coupons: boolean | null | object
  selected_payment_method: SelectedPaymentMethod
  prices: Prices2
  __typename: string
}

export interface Item {
  id: string
  uid: string
  prices: Prices
  product: Product
  quantity: number
  __typename: string
}

export interface Prices {
  total_item_discount: TotalItemDiscount
  price: Price
  discounts: boolean | null | object
  __typename: string
}

export interface TotalItemDiscount {
  value: number
  __typename: string
}

export interface Price {
  value: number
  currency: string
  __typename: string
}


export interface Image {
  url: string
  label: string
  __typename: string
}

export interface SelectedPaymentMethod {
  code: string
  title: string
  __typename: string
}

export interface Prices2 {
  discounts: boolean | null | object
  subtotal_excluding_tax: SubtotalExcludingTax
  grand_total: GrandTotal
  applied_taxes: []
  __typename: string
}

export interface SubtotalExcludingTax {
  value: number
  currency: string
  __typename: string
}

export interface GrandTotal {
  value: number
  currency: string
  __typename: string
}
