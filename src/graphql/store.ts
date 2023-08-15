import { gql } from "@apollo/client";

export const GET_ALL_STORES = gql`
  query {
    getAllStores {
      id,
      store_name,
      code
    }
  }
`