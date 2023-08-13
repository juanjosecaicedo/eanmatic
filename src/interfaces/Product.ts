export interface Product {
  name: string
  sku: string
  id: number|string
  image: Image
  price_range: PriceRange
  __typename: string
  weight: number
  url_key: string
  variants: Variant[]
  configurable_options: ConfigurableOption[],
  media_gallery: Image[]
}
export interface Image {
  url: string
  label: string
  __typename: string
}

export interface Variant {
  product: Product
  attributes: Attribute[]
  __typename: string
}

export interface Attribute {
  label: string
  code: string
  value_index: number
  __typename: string
}

export interface PriceRange {
  minimum_price: MinimumPrice
  maximum_price: MaximumPrice
  __typename: string
}
export interface MinimumPrice {
  regular_price: RegularPrice
  final_price: FinalPrice
  discount: Discount
  __typename: string
}

export interface RegularPrice {
  value: number
  currency: string
  __typename: string
}
export interface FinalPrice {
  value: number
  currency: string
  __typename: string
}

export interface Discount {
  amount_off: number
  percent_off: number
  __typename: string
}

export interface MaximumPrice {
  regular_price: RegularPrice2
  final_price: FinalPrice2
  discount: Discount2
  __typename: string
}

export interface RegularPrice2 {
  value: number
  currency: string
  __typename: string
}

export interface FinalPrice2 {
  value: number
  currency: string
  __typename: string
}

export interface Discount2 {
  amount_off: number
  percent_off: number
  __typename: string
}

export interface ConfigurableOption {
  id: number
  attribute_id: string
  label: string
  position: number
  use_default: boolean
  attribute_code: string
  values: Value[]
  product_id: number
  __typename: string
}

export interface Value {
  value_index: number
  label: string
  __typename: string
}