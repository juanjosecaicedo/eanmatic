import { gql } from "@apollo/client";

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      customer {
        firstname
        lastname
        email
        is_subscribed
      }
    }
  }
`

export const GENERATE_CUSTOMER_TOKEN = gql`
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export const GET_CUSTOMER = gql`
  query {
    customer {
      firstname
      lastname
      suffix
      email
      addresses {
        id
        firstname
        lastname
        street
        city      
        region {
          region_code
          region
          region_id
        }
        company
        postcode
        country_code
        country_id
        telephone
      }
    }
  }
`

export const CREATE_CUSTOMER_ADDRESS = gql`
  mutation CreateCustomerAddress($input: CustomerAddressInput!){
    createCustomerAddress(input: $input) {
      id
      region {
        region
        region_code
      }
      country_code
      street
      telephone
      postcode
      city
      default_shipping
      default_billing
    }
  }
`

export const CUSTOMER_CART = gql`
  query {
    customerCart {
      id,
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

export const MERGE_CARTS = gql`
  mutation MergeCarts($source_cart_id: String!, $destination_cart_id: String!) {
    mergeCarts(source_cart_id: $source_cart_id, destination_cart_id: $destination_cart_id) {
      items {
        product {
          name
          sku
        }
        quantity
      }
    }
  }
`