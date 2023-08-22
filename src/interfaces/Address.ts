export interface Address {
  firstname: string
  lastname: string
  company: string
  city: string
  street1: string
  street2: string
  region_id: string
  postcode: string
  country_code: string
  telephone: string
  save_in_address_book: boolean
}

export interface ShippingAddressCart {
  firstname: string
  lastname: string
  company: string
  street: string[]
  city: string
  region_id: string
  country_code: string
  postcode: string
  telephone: string
  save_in_address_book: boolean  
}