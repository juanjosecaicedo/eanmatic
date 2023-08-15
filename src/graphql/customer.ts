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

