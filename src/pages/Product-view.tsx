import { Product } from "@/interfaces/Product";
import { gql, useQuery } from "@apollo/client";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import ProductViewGellery from "./Product-view-gellery";
import ProductVariations from "@/components/product-variations";

const GET_PRODUCT_DETAILS = gql`
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

export default function ProductView() {
  const { id, sku, url, } = useParams()
  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    variables: {
      filter: {
        sku: {
          eq: sku
        },
        url_key: {
          eq: url
        }
      }
    }
  })


  if (loading) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <>Error! {error.message}</>
    )
  }


  const product: Product = data.products.items.find((item: Product) => item.id == id);
  const getCurrencySymbol = (locale: string, currency: string) => {
    return (0).toLocaleString(
      locale,
      {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    ).replace(/\d/g, '').trim()
  }
  console.log(product);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="p-2 col-span-1">
        <ProductViewGellery mediaGallery={product.media_gallery} />
      </div>
      <div className="p-2 col-span-1">
        <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {product.name}
        </h3>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          <span>{getCurrencySymbol('en-US', product.price_range.maximum_price.final_price.currency)} {product.price_range.maximum_price.final_price.value} </span>
        </h4>
        
        {product.__typename === "ConfigurableProduct" && (
          <ProductVariations showLabels={true} configurableOptions={product.configurable_options} variants={product.variants} />
        )}
      </div>
    </div>
  )
}