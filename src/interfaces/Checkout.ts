export interface Root {
  setShippingAddressesOnCart: SetShippingAddressesOnCart
}

export interface SetShippingAddressesOnCart {
  cart: Cart
  __typename: string
}

export interface Cart {
  shipping_addresses: ShippingAddress[]
  __typename: string
}

export interface ShippingAddress {
  firstname: string
  lastname: string
  company: string
  street: string[]
  city: string
  region: Region
  postcode: string
  telephone: string
  country: Country
  available_shipping_methods: AvailableShippingMethod[]
  __typename: string
}

export interface Region {
  code: string
  label: string
  __typename: string
}

export interface Country {
  code: string
  label: string
  __typename: string
}

export interface AvailableShippingMethod {
  carrier_code: string
  carrier_title: string
  method_code: string
  method_title: string
  amount: Amount
  __typename: string
}

export interface Amount {
  value: number
  __typename: string
}


export interface AdyenPaymentMethods {
  paymentMethodsExtraDetails: PaymentMethodsExtraDetail[]
  paymentMethodsResponse: PaymentMethodsResponse
  __typename: string
}

export interface PaymentMethodsExtraDetail {
  type: string
  icon?: Icon
  isOpenInvoice?: boolean
  configuration?: Configuration
  __typename: string
}

export interface Icon {
  url: string
  width: number
  height: number
  __typename: string
}

export interface Configuration {
  amount: Amount
  currency: string
  __typename: string
}
export interface Amount {
  value: number
  currency: string
  __typename: string
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[]
  __typename: string
}

export interface PaymentMethod {
  name: string
  type: string
  brand: string
  brands?: string[]
  configuration?: Configuration2
  details: string
  __typename: string
}

export interface Configuration2 {
  merchantId: string
  merchantName?: string
  __typename: string
}
