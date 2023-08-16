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
export const GET_STORE_CONFIG = gql`
  query {
    storeConfig {
      store_code
      store_name
      is_default_store
      store_group_code
      is_default_store_group
      locale
      base_currency_code
      default_display_currency_code
      timezone
      weight_unit
      base_url
      base_link_url
      base_static_url
      base_media_url
      secure_base_url
      secure_base_link_url
      secure_base_static_url
      secure_base_media_url
    }
  }
`