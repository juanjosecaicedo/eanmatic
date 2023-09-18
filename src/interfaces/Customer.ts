export interface Data {
  customer: Customer
}

export interface Customer {
  firstname: string
  lastname: string
  suffix: string
  email: string
  addresses: Address[]
}

export interface Address {
  firstname: string
  lastname: string
  street: string[]
  city: string
  region: Region
  postcode: string
  country_code: string
  telephone: string
  default_billing: boolean
  default_shipping: boolean
  customer_id: number
  gender: number
  id: number
  company: string
}

export interface Region {
  region_code: string
  region: string
  region_id: number
}