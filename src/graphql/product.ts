import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products(
    filter: {},
    sort: {name: ASC},
    pageSize: 5,
    currentPage: 1
    ) {
      total_count
      items {
        name
        sku
        id
        image {
          url
          label
        }
        __typename
        ... on ConfigurableProduct {
            configurable_options {
            id
            attribute_id
            label
            position
            use_default
            attribute_code
            values {
              value_index
              label
            }
            product_id
          }
          variants {
            product {
              id          
              sku
              attribute_set_id
              ... on PhysicalProductInterface {
                weight
              }
              price_range{
                minimum_price{
                  regular_price{
                    value
                    currency
                  }
                }
              }
            }
            attributes {
              label
              code
              value_index
            }
          }        
        }
        url_key        
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
    }
  }
`


export const GET_PRODUCT_DETAILS = gql`
  query  GetProducs($filter: ProductAttributeFilterInput!){
    products (filter: $filter ) {
      items {
        id
        name
        sku
        image {
          url
          label
        }
        small_image{
          url
          label
        }

        __typename
        ... on ConfigurableProduct {
            configurable_options {
            id
            attribute_id
            label
            position
            use_default
            attribute_code
            values {
              value_index
              label
            }
            product_id
          }
          variants {
            product {
              id          
              sku
              attribute_set_id
              ... on PhysicalProductInterface {
                weight
              }
              price_range{
                minimum_price{
                  regular_price{
                    value
                    currency
                  }
                }
              }
            }
            attributes {
              label
              code
              value_index
            }
          }                
        }
        media_gallery {
          url
          label
          ... on ProductVideo {
              video_content {
                  media_type
                  video_provider
                  video_url
                  video_title
                  video_description
                  video_metadata
              }
          }
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
    }
  }
`;
