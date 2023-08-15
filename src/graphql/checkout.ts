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