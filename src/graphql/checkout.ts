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
  query AdyenPaymentMethods($cartId: String!) {
    adyenPaymentMethods(cart_id: $cartId) {    
      name
      type
      brand
      brands
      isOpenInvoice
      iconUrl
      configuration {
        merchantId
        merchantName
        currency
        amount {
          value
          currency
        }        
      }
      details {
        key
        type
        optional
        items {
          id
          name
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
        uid
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
export const GET_ADYEN_KLARNA_DETAILS = gql`
  query getAdyenKlarnaDetails($cartId: String!, $email: String!) {
    getAdyenKlarnaDetails(
      cart_id: $cartId
      email: $email
      ) {
        resultCode
        order_number
        cart_id
        action {
          paymentMethodType
          url
          method
          type
          paymentData
      }
    }
  }
`

export const PALCE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!){
    placeOrder(input: $input) {
      order {
        order_number
        cart_id
      }
    }
  }
`

export const SET_PAYMENT_METHOD_AND_PLACE_ORDER = gql`
  mutation SetPaymentMethodAndPlaceOrder($input: SetPaymentMethodAndPlaceOrderInput!){
    setPaymentMethodAndPlaceOrder(input: $input) {
      order {
        order_id
      }
    }
  }
`

export const ADYEN_PAYMENT_STATUS = gql`
  query AdyenPaymentStatus($orderNumber: String!, $cartId: String!){
    adyenPaymentStatus(orderNumber: $orderNumber, cartId: $cartId) {
      isFinal
      resultCode
      additionalData
      action
    }
  }
`

export const CREATE_ADYEN_SESSION = gql`
  mutation CreateAdyenSession($input: CreateAdyenSessionInput!) {
    createAdyenSession(input: $input) {
      sessionData
      id
      merchantAccount
      reference
      returnUrl
      expiresAt
      countryCode
    }
  }
`

export const SET_PAYMENT_METHOD_AND_PLACE_ORDER_2 = gql`
  mutation SetPaymentMethodAndPlaceOrder($input1: SetPaymentMethodOnCartInput!, $input2: PlaceOrderInput!) {
    setPaymentMethodOnCart(input: $input1) {
      cart {
        selected_payment_method {
          code
          title
        }
      }
    }
    placeOrder(input: $input2) {
      order {
        order_number
        cart_id
      }
    }
  }
`

export const ADYEN_PAYMENT_DETAILS = gql`
  mutation getAdyenPaymentDetails($payload: String!, $cartId: String!) {
    adyenPaymentDetails(payload: $payload, cart_id: $cartId) {
      isFinal
      resultCode
      additionalData
      action
    }
  }
`

export const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemFromCart($input: RemoveItemFromCartInput!) {
    removeItemFromCart(input: $input) {
      cart {
        email
        items {
          id
          uid
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
  }

`

export const UPDATE_cART_ITEMS = gql`
  mutation UpdateCartItems($input: UpdateCartItemsInput!){
    updateCartItems(input: $input) {
      cart {
        email
        items {
          id
          uid
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
  }
`