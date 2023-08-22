import { gql } from "@apollo/client";

//Create a guest cart
export const CREATE_EMPTY_CART_GUEST = gql`
  mutation {
    createEmptyCart
  }
`

//Create a customer cart
export const CREATE_EMPTY_CART = gql`
  query {
    customerCart {
      id
    }
  }
`

export const ADD_CONFIGURABLE_PRODUCTS_TO_CART = gql`
  mutation AddConfigurableProductsToCart($input: AddConfigurableProductsToCartInput!) {
    addConfigurableProductsToCart(input: $input) {
      cart {
        items {
          id
          quantity
          product {
            name,
            sku
          }
          ... on ConfigurableCartItem {
            configurable_options {
              option_label
            }
          }
        }
      }
    }
  }
`

export const ADD_SIMPLE_PRODUCTS_TO_CART = gql`
  mutation AddSimpleProductsToCart($input: AddSimpleProductsToCartInput!) {
    addSimpleProductsToCart(input: $input) {
      cart {
        items {
          id
          quantity
          product {
            name,
            sku
          }        
        }
      }
    }
  }
`

export const SET_SHIPPING_ADDRESS_ON_CART = gql`
  mutation SetShippingAddressesOnCart($input: SetShippingAddressesOnCartInput!) {
    setShippingAddressesOnCart(input: $input) {
      cart {
        shipping_addresses {
          firstname
          lastname
          company
          street
          city
          region {
            code
            label
          }

          postcode
          telephone
          country {
            code
            label
          }

          available_shipping_methods{
            carrier_code
            carrier_title
            method_code
            method_title
            amount {
              value
              currency
            }
          }
        }
      }
    }
  }
`

export const SET_DELIVERY_METHOD = gql`
  mutation SetShippingMethodsOnCart($input: SetShippingMethodsOnCartInput){
    setShippingMethodsOnCart(input: $input){
      cart {
        shipping_addresses {
          selected_shipping_method {
            carrier_code
            method_code
            carrier_title
            method_title,
            amount {
              value
              currency
            }
          }
        }
      }
    }
  }
`

export const SET_SHIPPING_METHODS_ON_CART = gql`
  mutation SetShippingMethodsOnCart($input: SetShippingMethodsOnCartInput!) {
    setShippingMethodsOnCart(input: $input) {
      cart {
        shipping_addresses {
          selected_shipping_method {
            carrier_code
            method_code
            carrier_title
            method_title
          }
        }
      }
    }
  }
`

export const SET_GUEST_EMAIL_ON_CART = gql`
  mutation SetGuestEmailOnCart($input: SetGuestEmailOnCartInput!) {
    setGuestEmailOnCart(input: $input) {
      cart {
        email
      }
    }
  }
`

export const GET_ADYEN_PAYMEN_TMETHODS = gql`
  query getAdyenPaymentMethods($cartId: String!) {
    adyenPaymentMethods(cart_id: $cartId) {
      paymentMethodsExtraDetails {
        type
        icon {
          url
          width
          height
        }
        isOpenInvoice
        configuration {
          amount {
            value
            currency
          }
          currency
        }
      }
      paymentMethodsResponse {
        paymentMethods {
          name
          type
          brand
          brands
          configuration {
            merchantId
            merchantName
          }
          details {
            key
            type
            items {
              id
              name
            }
            optional
          }
        }
      }
    }
  }
`

export const SET_BILLING_ADDRESS_ON_CART = gql`
  mutation SetBillingAddressOnCart($input: SetBillingAddressOnCartInput!) {
    setBillingAddressOnCart(input: $input) {
      cart {
        billing_address {
          firstname
          lastname
          company
          street
          city
          region {
            code
            label
          }
          postcode
          telephone
          country {
            code
            label
          }
        }
      }
    }
  }
`

export const SET_PAYMENT_METHOD_ON_CART = gql`
  mutation SetPaymentMethodOnCart($input: SetPaymentMethodOnCartInput!) {
    setPaymentMethodOnCart(input: $input) {
      cart {
        selected_payment_method {
          code
        }
      }
    }
  }
`

export const CART = gql`
  query cart($cartId: String!){
    cart(cart_id: $cartId) {
      email
      items {
        id
        prices {
          total_item_discount {
            value
            currency
          }
          price {
            value
            currency
          }
          discounts {
            label
            amount {
              value
              currency
            }
          }
        }
        product {
          name
          sku
          id
          image {
            url
            label
          }
          price_range {
            maximum_price {
              regular_price {
                value
                currency
              }
              final_price {
                value
                currency
              }
              discount {
                amount_off
                percent_off
              }
            }
          }
        }
        quantity
      }
      applied_coupons {
        code
      }

      selected_payment_method {
        code
        title
      }

      prices {
        discounts {
          amount {
            value
          }
          label
        }
        subtotal_excluding_tax {
          value
          currency
        }
        grand_total {
          value
          currency
        }
        applied_taxes {
          label
          amount {
            value
            currency
          }
        }
      }
    }
  }
`

export const COUNTRIES = gql`
  query {
    countries {
      id
      two_letter_abbreviation
      three_letter_abbreviation
      full_name_locale
      available_regions {
        id
        code
        name
      }
    }
  }
`